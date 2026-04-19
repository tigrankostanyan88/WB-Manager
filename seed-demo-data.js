const DB = require('./src/models');

async function seedDemoData() {
  try {
    await DB.con.sync();
    
    const { Course, CourseRegistration } = DB.models;
    
    // Check if we have any courses
    let courses = await Course.findAll();
    
    if (courses.length === 0) {
      console.log('Creating demo courses...');
      courses = await Course.bulkCreate([
        {
          title: 'Wildberries-ի հիմունքներ',
          description: 'Սովորեք Wildberries-ում վաճառելու հիմնական սկզբունքները',
          price: 15000,
          category: 'Հիմունքներ',
          language: 'Հայերեն'
        },
        {
          title: 'Վաճառքների աճի ռազմավարություն',
          description: 'Ինչպես մեծացնել վաճառքները և շրջանառությունը',
          price: 25000,
          category: 'Ռազմավարություն',
          language: 'Հայերեն'
        },
        {
          title: 'SEO օպտիմիզացիա Wildberries-ում',
          description: 'Ապրանքների օպտիմիզացիա որոնման համակարգի համար',
          price: 20000,
          category: 'SEO',
          language: 'Հայերեն'
        }
      ]);
      console.log('✓ Demo courses created');
    } else {
      console.log(`Found ${courses.length} existing courses`);
    }
    
    // Check if we have any registrations
    const existingRegistrations = await CourseRegistration.count();
    
    if (existingRegistrations === 0) {
      console.log('Creating demo registrations...');
      
      const demoRegistrations = [
        {
          course_id: courses[0].id,
          name: 'Աննա Հակոբյան',
          phone: '091234567',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
          course_id: courses[0].id,
          name: 'Գագիկ Մարտիրոսյան',
          phone: '093456789',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          course_id: courses[1].id,
          name: 'Մարիամ Սարգսյան',
          phone: '077123456',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          course_id: courses[2].id,
          name: 'Հովհաննես Գրիգորյան',
          phone: '098765432',
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          course_id: courses[0].id,
          name: 'Լուսինե Պետրոսյան',
          phone: '094567123',
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
        },
        {
          course_id: courses[1].id,
          name: 'Արմեն Կարապետյան',
          phone: '096789012',
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        },
        {
          course_id: courses[2].id,
          name: 'Նարե Ավետիսյան',
          phone: '091112233',
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        {
          course_id: courses[0].id,
          name: 'Տիգրան Մկրտչյան',
          phone: '099887766',
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 days ago
        }
      ];
      
      await CourseRegistration.bulkCreate(demoRegistrations);
      console.log('✓ 8 demo registrations created');
    } else {
      console.log(`Found ${existingRegistrations} existing registrations`);
    }
    
    console.log('\n✅ Demo data seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding demo data:', error);
    process.exit(1);
  }
}

// seedDemoData();
