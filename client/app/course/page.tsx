import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CourseHero, { type CourseHeroData } from './_components/CourseHero'
import WhatYouLearn from './_components/WhatYouLearn'
import CourseSyllabus, { type Module } from './_components/CourseSyllabus'
import CourseRequirements from './_components/CourseRequirements'
import CourseDescription from './_components/CourseDescription'
import CourseInstructors, { type Instructor } from './_components/CourseInstructors'
import CourseSidebar from './_components/CourseSidebar'

export default function CoursePage() {
  const course: CourseHeroData = {
    title: 'WB Mastery · Վաճառքներ Wildberries-ում',
    description: 'Սկսիր և զարգացրու վաճառքդ Wildberries-ում՝ քայլ առ քայլ ծրագրով, գործնական հմտություններով և մենթորի աջակցությամբ։',
    rating: 4.9,
    reviewsCount: 124,
    studentsLabel: '1,540 ուսանող',
    author: 'WB-Manager Team',
    updatedAt: 'Հունվար 2024',
    language: 'Հայերեն'
  }
  
  const learn = [
    'Ապրանքի ընտրություն և մատակարարների հետ աշխատանքի հիմունքներ',
    'Քարտերի ստեղծում և օպտիմալացում Wildberries-ում',
    'Լոգիստիկա, գների մոդելավորում և շահութաբերություն',
    'Մարքեթինգ, ակցիաներ և մասշտաբավորում',
    'Վաճառքի վերլուծություն և հաշվետվությունների կազմում',
    'Մրցակիցների վերլուծություն և ռազմավարության մշակում'
  ]

  const syllabus: Module[] = [
    {
      title: 'Մոդուլ 1 · Ներածություն և պլանավորում',
      lectures: 3,
      duration: '45 րոպե',
      items: [
        { title: 'Wildberries պլատֆորմի կառուցվածքը', type: 'video', time: '15:00' },
        { title: 'Թիրախավորում և դիրքավորում', type: 'video', time: '20:00' },
        { title: 'Սկզբնական հաշվարկներ (Unit Economy)', type: 'file', time: '10:00' }
      ]
    },
    {
      title: 'Մոդուլ 2 · Ապրանքի ընտրություն և մատակարարներ',
      lectures: 4,
      duration: '1 ժամ 20 րոպե',
      items: [
        { title: 'Գաղափարից մինչև փորձարկում', type: 'video', time: '25:00' },
        { title: 'Մատակարարների որոնում (Չինաստան vs Տեղական)', type: 'video', time: '30:00' },
        { title: 'Պայմանագրեր և որակի ստուգում', type: 'video', time: '15:00' },
        { title: 'Մատակարարների բազա', type: 'file', time: '10:00' }
      ]
    },
    {
      title: 'Մոդուլ 3 · Քարտերի ձևավորում',
      lectures: 3,
      duration: '1 ժամ',
      items: [
        { title: 'Վերնագրեր և նկարագրություն (SEO)', type: 'video', time: '25:00' },
        { title: 'Լուսանկարներ և վիզուալ մարքեթինգ', type: 'video', time: '20:00' },
        { title: 'Վերանայումներ և գնահատականներ', type: 'video', time: '15:00' }
      ]
    },
    {
      title: 'Մոդուլ 4 · Գործարկում և մասշտաբավորում',
      lectures: 4,
      duration: '1 ժամ 45 րոպե',
      items: [
        { title: 'Սկզբնական վաճառքներ (Самовыкупы)', type: 'video', time: '30:00' },
        { title: 'Մարքեթինգային ներքին խողովակներ', type: 'video', time: '35:00' },
        { title: 'Արտաքին գովազդ', type: 'video', time: '25:00' },
        { title: 'Աճ և ավտոմատացում', type: 'video', time: '15:00' }
      ]
    },
  ]

  const requirements = [
    'Համակարգիչ կամ նոութբուք ինտերնետ հասանելիությամբ',
    'Wildberries-ում գրանցված գործընկերոջ հաշիվ (ցանկալի է, բայց պարտադիր չէ)',
    'Սովորելու և կիրառելու պատրաստակամություն'
  ]

  const instructors: Instructor[] = [
    {
      name: 'Արմեն Սարգսյան',
      role: 'Wildberries Մենթոր & Seller',
      desc: '5 տարվա փորձ E-commerce ոլորտում, 100+ հաջողված քեյսեր։',
      imageUrl: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=400&auto=format&fit=crop',
      ratingText: '4.9 վարկանիշ',
      coursesText: '12 դասընթաց'
    },
    {
      name: 'Ավա Բրես',
      role: 'Մարքեթինգի մասնագետ',
      desc: 'Մասնագիտացած է թվային մարքեթինգում և բրենդինգում։',
      imageUrl: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=400&auto=format&fit=crop',
      ratingText: '4.9 վարկանիշ',
      coursesText: '12 դասընթաց'
    }
  ]

  const includes = [
    '6 ժամ ընդհանուր տևողություն',
    '12 ներբեռնվող ռեսուրսներ',
    'Անսահմանափակ մուտք',
    'Հասանելի բջջայինով և TV-ով',
    'Ավարտական վկայական'
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <Header forceWhiteBackground />
      <CourseHero course={course} />

      <main className="container max-w-[1200px] mx-auto px-4 md:px-6 pt-16 pb-10 relative">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <div className="lg:w-2/3 space-y-10">
            <WhatYouLearn learn={learn} />
            <CourseSyllabus syllabus={syllabus} />
            <CourseRequirements requirements={requirements} />
            <CourseDescription />
            <CourseInstructors instructors={instructors} />
          </div>

          <CourseSidebar price="$49.99" originalPrice="$99.00" discount="50% ԶԵՂՉ" includes={includes} />

        </div>
      </main>

      <Footer />
    </div>
  )
}
