const fs = require("fs");
const crypto = require("crypto");
const sharp = require("sharp");
const config = require("../config/app.config");

/**
 * File upload and processing class
 * Handles image resizing, validation, and storage with security checks
 */
module.exports = class File {
    constructor(model, file, options = {}) {
        this.data = {};
        this.data.model = model;
        this.data.file = file;
        this.data.options = options;

        // result
        this.status = "error";
        this.message = {};

        this._setTableData();
    }

    /* Main methods */
    async add(name_used) {
        this.table.name_used = name_used;

        // 1) Check allowed - media[size, type], names
        const allowed = await this._checkAllowed();
        if (allowed.status == "error") {
            this.message = allowed.messages;
            return this._result();
        }

        // 2) Check media
        // image
        if (allowed.media.name == "image") {
            this.data.file.watermark = allowed.limits.watermark || false;

            if (allowed.limits.dimensions) {
                const { width, height } = this.data.file.metadata;
                const dimensions = allowed.limits.dimensions;

                if (dimensions.large) {
                    const resizeSaveLarge = await this._saveImage(width, height, dimensions, "large");
                    if (!resizeSaveLarge) return this._result();
                }
                if (dimensions.small) {
                    const resizeSaveSmall = await this._saveImage(width, height, dimensions, "small");
                    if (!resizeSaveSmall) return this._result();
                }
            } else {
                const saveImage = await this._saveImage();
                if (!saveImage) return this._result();
            }
        }
        // audio, video, application (pdf, zip)
        else {
            const saveFile = await this._saveFile();
            if (!saveFile) return this._result();
        }

        this.status = "success";
        return this._result();
    }

    async replace(name_used) {
        if (!this.data.model.files) {
            this.message.files = `In "${this.table.table_name}" model "files" are not included.`;
            return this._result();
        }

        // 1) Remove old files
        const oldFiles = this.data.model.files.filter((f) => f.name_used == name_used);

        for (const oldFile of oldFiles) {
            const deleted = await this._deleteFiles(oldFile);
            
            if (deleted) {
                await oldFile.destroy();
                const index = this.data.model.files.indexOf(oldFile);
                if (index > -1) {
                    this.data.model.files.splice(index, 1);
                }
            }
        }

        // 2) Add new file
        return await this.add(name_used);
    }

    async _deleteFiles(fileData) {
        const media = fileData.type ? fileData.type.split("/")[0] : null;

        try {
            if (media === "image") {
                const imageSizes = ["large", "small"];
                const baseFilePath = `./public/images/${this.table.table_name}`;
    
                
                for (const size of imageSizes) {
                    const filePath = `${baseFilePath}/${size}/${fileData.name}.${fileData.ext}`;
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            } else {
                const filePath = `./public/files/${this.table.table_name}/${fileData.name}${fileData.ext}`;
                if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            }
            return true;
        } catch (err) {
            console.error("Error deleting file:", err);
            return false;
        }
    }

    /* Inner methods */
    _setTableData() {
        this.table = {};
        this.table.table_name = this.data.model.constructor.name;
        this.table.row_id = this.data.model.id;
        this.table.name_original = this.data.file.name;
        this.table.name = crypto
            .createHash("sha1")
            .update(`${this.table.name_original}-${Date.now()}`)
            .digest("hex");
        this.table.type = this.data.file.mimetype;
        this.table.col_name = this.data.options.col_name || null;
        this.table.title = this.data.options.title || null;
        this.table.ext = this.data.file.name.slice(this.data.file.name.lastIndexOf("."));
        this.table.sizes = [this.data.file.size];
    }

    async _checkAllowed() {
        const allowed = {};

        const media = this.data.file.mimetype.split("/")[0];
        const type = this.table.type.split("/")[1];
        const size = this.data.file.size;
        const count = this.data.model.files.filter(
            (f) => f.name_used == this.table.name_used
        ).length;

        allowed.limits = this._getAllowedLimits(this.table.table_name, this.table.name_used);
        allowed.media = this._getAllowedMedia(media);
        allowed.status = "error";
        allowed.messages = {};

        if (!allowed.media) {
            allowed.messages.media = `The "${this.data.file.mimetype}" media type is not allowed.`;
        } else {
            if (allowed.media.size < size) {
                allowed.messages.size = `The size (${size} bytes) is too large, limit is ${allowed.media.size} bytes.`;
            }
        }

        if (allowed.limits.status != "success") {
            if (allowed.limits.reason == "table") {
                allowed.messages.table = `Table "${this.table.table_name}" not found.`;
            }
            if (allowed.limits.reason == "name") {
                allowed.messages.name = `Name "${this.table.name_used}" for table "${this.table.table_name}" not found.`;
            }
        } else {
            if (allowed.limits.count <= count) {
                allowed.messages.count = `Count limit for "${this.table.name_used}" in "${this.table.table_name}" table is "${allowed.limits.count}" ${allowed.limits.count > 1 ? "files" : "file"}.`;
            }

            if (media != "image") {
                if (!allowed.limits.types.includes(type)) {
                    allowed.messages.type = `The type "${type}" is not allowed. Allowed types are "${allowed.limits.types.toString()}".`;
                }
            } else {
                await this._setMetadata();
                this.table.ext = this.data.file.metadata.format;
                this.table.sizes = {};

                if (!allowed.limits.types.includes(this.table.ext)) {
                    allowed.messages.format = `For "${this.table.name_used}" is not allowed "${this.table.ext}" format. Allowed only "${allowed.limits.types.join(", ")}" ${allowed.limits.types.length > 1 ? "formats" : "format"}.`;
                }
            }
        }

        if (!Object.keys(allowed.messages).length) {
            allowed.status = "success";
            delete allowed.messages;
        }

        return allowed;
    }

    _getAllowedLimits(table, name) {
        const names = [
            {
                table: "courses",
                files: [{
                    name: "course_img",
                    count: 1,
                    types: ["jpeg", "png", "webp", "svg"],
                    dimensions: { large: [1280, 720], small: [640, 360] },
                }],
            },
            {
                table: "instructors",
                files: [{
                    name: "instructor_img",
                    count: 10,
                    types: ["jpeg", "png", "webp", "svg"],
                    dimensions: { large: [800, 800] },
                }],
            },
            {
                table: "settings",
                files: [{
                    name: "logo_img",
                    count: 1,
                    types: ["jpeg", "png", "webp", "svg"],
                    dimensions: { large: [300, 300] },
                }],
            },
            {
                table: "users",
                files: [{
                    name: "user_img",
                    count: 3,
                    types: ["jpeg", "png", "gif", "webp", "svg"],
                    dimensions: { large: [500, 500] },
                }],
            },
            {
                table: "modules",
                files: [{
                    name: "module_video",
                    count: 90,
                    types: ["mp4", "mkv", "avi", "mov", "webm"],
                }],
            },
            {
                table: "hero_content",
                files: [{
                    name: "hero_video",
                    count: 90,
                    types: ["mp4", "mkv", "avi", "mov"],
                }],
            },
        ];

        let tableData = names.find((n) => n.table == table);
        if (!tableData) return { status: "error", reason: "table" };

        let nameData = tableData.files.find((n) => n.name == name);
        if (!nameData) return { status: "error", reason: "name" };

        nameData.status = "success";
        return nameData;
    }

    _getAllowedMedia(media) {
        const mediaTypes = [
            {
                name: "image",
                types: config.FILE_TYPES.IMAGE.types,
                size: config.FILE_TYPES.IMAGE.maxSize,
            },
            {
                name: "video",
                types: config.FILE_TYPES.VIDEO.types,
                size: config.FILE_TYPES.VIDEO.maxSize,
            },
            {
                name: "audio",
                types: config.FILE_TYPES.AUDIO.types,
                size: config.FILE_TYPES.AUDIO.maxSize,
            },
            {
                name: "application",
                types: config.FILE_TYPES.DOCUMENT.types,
                size: config.FILE_TYPES.DOCUMENT.maxSize,
            },
        ];

        return mediaTypes.find((m) => m.name === media);
    }

    async _setMetadata() {
        const { format, width, height } = await sharp(this.data.file.data).metadata();
        this.data.file.metadata = { format, width, height };
    }

    async _saveImage(width, height, dimensions, size) {
        let image = sharp(this.data.file.data);
        let targetFormat = ["jpeg", "png", "webp"].includes(this.table.ext) ? this.table.ext : "webp";
        let quality = targetFormat === "png" ? 90 : 82;

        const pathSize = size ? `/${size}` : "";
        const pathStart = `./public/images/${this.table.table_name}${pathSize}`;
        this.table.ext = targetFormat;
        const pathFile = `${this.table.name}.${this.table.ext}`;
        const fullPath = `${pathStart}/${pathFile}`;

        if (!fs.existsSync(pathStart)) fs.mkdirSync(pathStart, { recursive: true });

        if (width && height && dimensions) {
            if (width < dimensions[size][0]) {
                this.message.width = `Image width is ${width}, but must be >= ${dimensions[size][0]} (${size}: ${dimensions[size].join("x")})`;
                return false;
            }
            if (height < dimensions[size][1]) {
                this.message.height = `Image height is ${height}, but must be >= ${dimensions[size][1]} (${size}: ${dimensions[size].join("x")})`;
                return false;
            }
            image = image.resize(dimensions[size][0], dimensions[size][1], { fit: "inside" });
        } else {
            image = image.resize(800, 800, { fit: "inside" });
        }

        if (this.data.file.watermark) this._addWatermark(image);

        try {
            const imageNew = await image.toFormat(targetFormat, { quality }).toFile(fullPath);

            if (width && height && dimensions) {
                this.table.sizes[size] = {
                    size: imageNew.size,
                    width: imageNew.width,
                    height: imageNew.height,
                };
            } else {
                this.table.sizes = {
                    size: imageNew.size,
                    width: imageNew.width,
                    height: imageNew.height,
                };
            }

            return { status: "success" };
        } catch (err) {
            if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
            this.message.file = "Image not saved... ⚠️";
            this.message.err = err;
            return false;
        }
    }

    async _saveFile() {
        let pathStart = `./public/files`;

        if (this.table.table_name) {
            pathStart = `./public/files/${this.table.table_name}`;
        }

        const pathFile = `${this.table.name}${this.table.ext}`;

        if (this.table.name_used === "summernote") {
            pathStart = `./public/files/summernote`;
        }

        if (!fs.existsSync(pathStart)) {
            fs.mkdirSync(pathStart, { recursive: true });
        }

        try {
            await this.data.file.mv(`${pathStart}/${pathFile}`);
            return { status: "success" };
        } catch (err) {
            this.message.file = "File not saved";
            this.message.err = err;
            return false;
        }
    }

    _addWatermark(image) {
        if (image.options.width >= 600 && image.options.height >= 600) {
            let pathWatermrk = "./public/images/watermark_xl.png",
                offsetX = image.options.width - 161 - 15,
                offsetY = image.options.height - 161 - 15;
            image.composite([{ input: pathWatermrk, left: offsetX, top: offsetY }]);
        }
    }

    _result() {
        delete this.data;
        this.status == "error" ? delete this.table : delete this.message;
        return this;
    }
};