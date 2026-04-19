const routes = require('../routes');

module.exports = api = (app) => {
    try {
        const regs = [
            ['/api/v1/users', routes.user, 'user'],
            ['/api/v1/faq', routes.faq, 'faq'],
            ['/api/v1/registration', routes.registration, 'registration'],
            ['/api/v1/register-course', routes.courseRegistration, 'courseRegistration'],
            ['/api/v1/reviews', routes.review, 'reviews'],
            ['/api/v1/instructor', routes.instructor, 'instructor'],
            ['/api/v1/courses', routes.courses, 'courses'],
            ['/api/v1/modules', routes.modules, 'modules'],
            ['/api/v1/student-courses', routes.studentCourse, 'studentCourse'],
            ['/api/v1/settings', routes.settings, 'settings'],
            ['/api/v1/bank-cards', routes.bankCard, 'bankCard'],
            ['/api/v1/payments', routes.payment, 'payment'],
            ['/api/v1/files', routes.file, 'file'],
            ['/api/v1/contact-info', routes.contactMessage, 'contactMessage'],
            ['/api/v1/hero-content', routes.heroContent, 'heroContent'],
        ];
        for (const [path, router, name] of regs) {
            if (typeof router !== 'function') {
                console.error(`[API] skipped ${name}: expected function, got ${typeof router}`);
                continue;
            }
            app.use(path, router);
        }
    } catch (e) {
        console.error('[API] registration error:', e);
        throw e;
    }
};


