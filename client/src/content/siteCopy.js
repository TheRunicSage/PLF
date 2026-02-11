export const siteCopy = {
  global: {
    siteName: 'Punjab Lit Foundation',
    brand: {
      logoUrl: '/assets/brand/plf-logo.png',
      logoAlt: 'Punjab Lit Foundation logo',
    },
    tagline: 'Enlighten. Connect. Support.',
    shortMission:
      "Celebrating Punjab's literary and cultural heritage while fostering creativity and community-led social action.",
    ctas: {
      donate: 'Donate',
      donateNow: 'Donate now',
      knowMore: 'Know more',
      aboutUs: 'About us',
      contactUs: 'Contact us',
      viewProjects: 'View projects',
      viewUpdates: 'View updates',
      seeAll: 'See all',
      readMore: 'Read more',
      details: 'Details',
      explore: 'Explore',
    },
    contact: {
      email: 'punjablitfoundation@gmail.com',
      phoneDisplay: '+91 9876020800',
      phoneHref: '+919876020800',
    },
    social: {
      instagramLabel: 'Instagram',
      instagramUrl: 'https://www.instagram.com/punjablitfoundation/',
    },
    policies: {
      privacy: {
        label: 'Privacy Policy',
        to: '/privacy-policy',
      },
      terms: {
        label: 'Terms and Conditions',
        to: '/terms-and-conditions',
      },
      refund: {
        label: 'Refund Policy',
        to: '/refund-policy',
      },
    },
  },

  nav: {
    directLinks: [
      { to: '/', label: 'Home', end: true },
      { to: '/about', label: 'About' },
      { to: '/contact', label: 'Contact' },
    ],
    dropdownGroups: [
      {
        key: 'projects',
        label: 'Projects',
        links: [
          { to: '/projects', label: 'All Projects' },
          { to: '/projects?status=ongoing', label: 'Ongoing Initiatives' },
          { to: '/projects?status=completed', label: 'Completed Initiatives' },
        ],
      },
      {
        key: 'updates',
        label: 'Updates',
        links: [
          { to: '/blog', label: 'All Updates' },
          { to: '/blog?type=news', label: 'News' },
          { to: '/blog?type=event', label: 'Events' },
        ],
      },
    ],
  },

  footer: {
    heading: "Celebrating Punjab's literary and cultural heritage.",
    description:
      "We nurture creativity, knowledge-based narratives, and community initiatives that uplift Punjab's cultural and social fabric.",
    quickLinksTitle: 'Quick Links',
    contactTitle: 'Connect With Us',
    quickLinks: [
      { label: 'About', to: '/about', external: false },
      { label: 'Projects', to: '/projects', external: false },
      { label: 'Donate', to: '/donate', external: false },
      { label: 'Updates', to: '/blog', external: false },
    ],
    copyrightSuffix: 'All rights reserved.',
  },

  home: {
    hero: {
      kicker: 'Punjab Lit Foundation',
      title: 'Enlighten. Connect. Support.',
      subtitle:
        "Celebrating Punjab's literary and cultural heritage. The Punjab Lit Foundation fosters creativity and uplifts the region's intellectual capacity.",
      primaryCta: { label: 'Donate now', to: '/donate' },
      secondaryCta: { label: 'Know More', to: '/about' },
    },
    mission: {
      kicker: 'About Us',
      title: 'About Us',
      description:
        "Welcome to the Punjab Lit Foundation, a creative endeavor co-founded by esteemed authors Khushwant Singh and Sanna Kaushal. As a non-profit organization, we are committed to fostering knowledge-based narratives and uplifting the cultural and social status of Punjab. Our mission is to promote and cultivate creativity, empower the region to build its creative wealth, and elevate its intellectual capacity to new heights.",
      cta: { label: 'Know More', to: '/about' },
    },
    story: {
      kicker: 'Our Story',
      body:
        "Co-founded by authors Khushwant Singh and Sanna Kaushal, Punjab Lit Foundation grew from Hoshiarpur's literary movement into a wider platform for festivals, workshops, and campaigns for social good.",
    },
    impact: {
      kicker: 'Creative impact',
      stat: 'Creative Punjab',
      caption:
        'From literature festivals to grassroots outreach, we bring culture, conversation, and collective action together.',
      cta: { label: 'Explore initiatives', to: '/projects' },
    },
    donateBanner: {
      kicker: 'Donate',
      title: 'Donation For Foundation',
      cardTitle: 'Contribute with confidence',
      cardSubtitle:
        'Your support helps sustain literary programs, public conversations, and social campaigns across Punjab.',
      donateLinkLabel: 'Donate via secure link',
      donateLinkPendingLabel: 'Donate link coming soon',
      bankTitle: 'Bank transfer details',
      bankFallback: 'Bank details will be updated shortly.',
      qrTitle: 'Scan QR Code To Donate',
      qrFallback: 'QR options will be available soon.',
      loading: 'Loading donation details...',
      loadError: 'Unable to load donation settings.',
    },
    waysToHelp: {
      kicker: 'Ways to help',
      title: 'Stand with us through culture, awareness, and service.',
      description:
        'Support literary programs, social campaigns, and relief-led initiatives that strengthen communities.',
      cards: [
        {
          title: "People's Walk Against Drugs",
          description: 'Join awareness-led public outreach and community mobilization walks.',
          to: '/projects',
          mediaClass: 'media-placeholder--olive',
        },
        {
          title: 'Mothers Against Drugs',
          description: 'Support sessions that equip mothers and families with practical awareness tools.',
          to: '/projects',
          mediaClass: 'media-placeholder--blue',
        },
        {
          title: 'Seed Sewa & Fertiliser Sewa',
          description: 'Help support flood-affected farmers through essential agricultural aid.',
          to: '/projects',
          mediaClass: 'media-placeholder--sun',
        },
      ],
      exploreLabel: 'Explore',
    },
    events: {
      heading: 'Upcoming Events',
      description:
        "Join us for our upcoming events! From exciting workshops to inspiring talks and community gatherings, there's something for everyone.",
      seeAllLabel: 'See all',
      loading: 'Loading upcoming events...',
      empty: 'No upcoming events right now.',
      locationFallback: 'Location to be announced',
      detailsLabel: 'Details',
    },
    videos: {
      heading: 'Video highlights',
      cards: [
        {
          title: "People's Walk Against Drugs yatra",
          mediaClass: 'media-placeholder--blue',
          videoUrl: '',
        },
        {
          title: 'Mothers Against Drugs awareness initiative',
          mediaClass: 'media-placeholder--olive',
          videoUrl: '',
        },
        {
          title: "Living By The Pen: The Writer's Way",
          mediaClass: 'media-placeholder--sun',
          videoUrl: '',
        },
        {
          title: 'Chandigarh Lit Fest conversations',
          mediaClass: 'media-placeholder--mint',
          videoUrl: '',
        },
      ],
      playLabel: 'Play video',
    },
    featuredProject: {
      heading: 'Featured initiative',
      loading: 'Loading featured initiative...',
      empty: 'Featured initiative will appear soon.',
      ctaLabel: 'Read initiative brief',
    },
    latestUpdates: {
      heading: 'Latest News',
      description:
        'Follow recent updates from literature programs, community outreach, and social campaigns.',
      loading: 'Loading latest updates...',
      empty: 'Latest updates will appear here soon.',
      excerptFallback: 'Read the full update for details.',
      ctaLabel: 'Read more',
    },
    ctaBanner: {
      title: 'Contact Us',
      description: 'Contact us to learn more about programs and events.',
      primaryCta: { label: 'Contact us', to: '/contact' },
      secondaryCta: { label: 'Know More', to: '/about' },
    },
    errors: {
      events: 'Unable to load events.',
      projects: 'Unable to load projects.',
      posts: 'Unable to load updates.',
      settings: 'Unable to load donation settings.',
    },
  },

  about: {
    header: {
      kicker: 'About Punjab Lit Foundation',
      title: "A creative nonprofit rooted in Punjab's literary and social journey.",
      description:
        "Punjab Lit Foundation is a co-founded effort by Khushwant Singh and Sanna Kaushal to uplift Punjab's cultural and social status through creativity, literature, and community engagement.",
    },
    mission: {
      kicker: 'Our mission',
      title: 'Our mission',
      text:
        "At the Punjab Lit Foundation, our mission is multifaceted: we strive to promote and cultivate creativity, empowering the region to build its creative wealth. Additionally, we are committed to uplifting Punjab's cultural and social status through knowledge-based narratives. By doing so, we aim to elevate the intellectual capacity of the region to new heights, fostering a vibrant and enriched cultural landscape. Join us in our journey to celebrate the richness of Punjab's literary and cultural heritage.",
      backgroundImageUrl: '/assets/about/about-header-bg.png',
      portraitImageUrl: '/assets/about/mission-portrait.png',
    },
    leadershipHeading: 'Co-founders',
    leaders: [
      {
        name: 'Khushwant Singh',
        role: 'Co-founder | Author, Philanthropist, Creative Activist',
        bio:
          "He is distinguished as an author, philanthropist, and creative activist. A literary luminary of contemporary India, he boasts a repertoire of six published works, alongside notable roles as a columnist, editor, and as the State Information Commissioner of Punjab. Singh's patronage of the Hoshiarpur Lit Fest, the preeminent literary gathering of Punjab, underscores his commitment to fostering intellectual discourse within his home state. Renowned for his innovative approach to narrative construction, Singh continues to push the boundaries of creativity in service of Punjab's cultural narrative. Notably, his 100-kilometer walk against drug abuse in December 2023 stands as a testament to his dedication to societal betterment.",
        imageUrl: '/assets/about/khushwant-singh.jpeg',
      },
      {
        name: 'Sanna Kaushal',
        role: 'Co-founder | Author',
        bio:
          'Her leadership has been instrumental in advancing literary endeavors in Punjab. Notably, she led the transformation of the Hoshiarpur Lit Society into the Punjab Lit Foundation, renowned for organizing prestigious literary events. Additionally, she championed the "Parhada Punjab, Vadhda Punjab" initiative, conducting regular creative writing workshops and establishing two mobile libraries to enhance access to books for citizens. As a published author, Sanna Kaushal has gained recognition for her debut book "Hands That Disobeyed" and has contributed her voice to various topics through her articles in the Hindustan Times column "Spice of Life." Passionate about empowering women, Sanna is dedicated to unveiling the untapped potential within the women of her country, striving to amplify their voices and opportunities.',
        imageUrl: '/assets/about/sanna-kaushal.jpeg',
      },
    ],
    libraryImageUrl: '/assets/about/library-on-wheels.png',
    libraryImageAlt: 'Punjab Lit Foundation library on wheels',
  },

  projects: {
    header: {
      kicker: 'Projects / Initiatives',
      title: 'Literary and social initiatives led by Punjab Lit Foundation.',
      description:
        "Explore ongoing and completed work, from public awareness campaigns to relief efforts such as Seed Sewa and Fertiliser Sewa.",
    },
    loading: 'Loading projects and initiatives...',
    loadError: 'Unable to load projects right now.',
    empty: 'No projects found for this filter.',
    viewDetailsLabel: 'View initiative',
  },

  projectDetail: {
    backLabel: 'Back to projects',
    loading: 'Loading project details...',
    loadError: 'Unable to load project details.',
    presentLabel: 'Present',
  },

  updates: {
    header: {
      kicker: 'News / Events / Stories',
      title: 'Updates from Punjab Lit Foundation activities.',
      description:
        'Track festivals, workshops, outreach drives, and campaign highlights from across our initiatives.',
    },
    loading: 'Loading updates...',
    loadError: 'Unable to load updates right now.',
    empty: 'No updates found for this filter.',
    excerptFallback: 'Read the complete update for details.',
    readMoreLabel: 'Read more',
    previousLabel: 'Previous',
    nextLabel: 'Next',
    pageLabel: 'Page',
    ofLabel: 'of',
    detail: {
      backLabel: 'Back to updates',
      loading: 'Loading update...',
      loadError: 'Unable to load this update.',
      eventDetailsHeading: 'Event details',
      eventStartsLabel: 'Starts',
      eventEndsLabel: 'Ends',
      eventLocationLabel: 'Location',
      relatedHeading: 'Related updates',
      openPostLabel: 'Open update',
    },
  },

  donate: {
    kicker: 'Donate',
    title: 'Make your generous donations for the foundation.',
    description:
      'Your contribution strengthens literary programs, social awareness campaigns, and community support initiatives.',
    donateNowLabel: 'Donate now',
    donatePendingLabel: 'Donate link coming soon',
    loading: 'Loading donation details...',
    loadError: 'Unable to load donation settings.',
    bankDetailsHeading: 'Bank transfer details',
    bankDetailsFallback: 'Bank details will be updated shortly.',
    qrHeading: 'Scan QR Code To Donate',
    qrFallback: 'QR options will be available soon.',
  },

  contact: {
    kicker: 'Contact us',
    title: "We'd love to hear from you.",
    description:
      'Feel free to contact us with any questions or concerns. You can use the form below or write to us directly.',
    successMessage: 'Thank you for writing to us. Our team will get back to you soon.',
    submitButton: 'Submit',
    nameLabel: 'Name',
    emailLabel: 'Email',
    phoneLabel: 'Phone (optional)',
    messageLabel: 'Message',
    placeholders: {
      name: 'Your name',
      email: 'you@example.com',
      phone: '+91 9876020800',
      message: 'How can we help?',
    },
  },

  admin: {
    login: {
      title: 'Sign in to manage Punjab Lit Foundation content',
      description: 'Use admin credentials to access updates, projects, and donation settings.',
      backToSiteLabel: 'Back to website',
      loginButtonLabel: 'Login',
    },
  },

  policyPages: {
    privacy: {
      kicker: 'Policy',
      title: 'Privacy Policy for Punjab Lit Foundation',
      fullText: `Effective Date: March 30, 2024

1. Introduction Punjab Lit Foundation is committed to protecting your privacy. This Privacy Policy outlines how we collect, use, and protect your personal information when you visit our website.

2. Information We Collect We may collect the following types of information:

Personal Information: Name, email address, phone number, and mailing address when you make a donation, sign up for newsletters, or contact us.

3. How We Use Your Information We use the collected information for the following purposes:

To process donations and provide receipts.

4. Sharing of Information We do not sell or rent your personal information to third parties. We may share information with trusted partners to help us operate our website or conduct our activities, provided that those parties agree to keep the information confidential.

5. Data Security We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction.

6. Cookies Our website may use cookies to enhance your Browse experience. You can set your browser to refuse cookies, but this may affect your ability to use certain features of the site.

7. Third-Party Links Our website may contain links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.

8. Children's Privacy Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from children. If we become aware that we have collected information from a child without verification of parental consent, we will take steps to remove that information.

9. Your Rights You have the right to access, update, or delete your personal information at any time. To do so, please contact us at maxwell.charitable@gmail.com.

10. Changes to This Policy We reserve the right to update this Privacy Policy at any time. Changes will be effective immediately upon posting on our website. Continued use of our website indicates acceptance of the revised policy.

11. Contact Information 

Punjab Lit Foundation SKG Natural, Tanda Road, 
Opposite Windsor Manor, Railway Road (Hoshiarpur), 
Hoshiarpur, Hoshiarpur- 146001, 
Punjab Phone: +91 78888 47575 
Email: punjablitfoundation@gmail.com`,
    },
    terms: {
      kicker: 'Policy',
      title: 'Terms and Conditions',
      fullText: `Effective Date: March 30, 2024

1. Introduction :Welcome to the official website of Punjab Lit Foundation. By accessing or using our website, you agree to comply with and be bound by these Terms and Conditions.

2. Eligibility :Use of our website is intended for individuals who are 18 years of age or older. If you are under 18, you may use our website only with the involvement of a parent or guardian.

3. Use of Website

You agree to use our website for lawful purposes only. Prohibited activities include, but are not limited to:

Posting or transmitting any unlawful, threatening, defamatory, obscene, or otherwise objectionable content.

Engaging in any activity that could harm or disrupt our website or services.

Attempting to gain unauthorized access to any portion of our website.

4. Intellectual Property: All content on our website, including text, graphics, logos, and images, is the property of Punjab Lit Foundation or its content suppliers and is protected by applicable intellectual property laws. Unauthorized use of any content is prohibited.

5. Donations: Donations made through our website are used to support our various initiatives. While we strive to allocate funds as designated by donors, we reserve the right to use donations where they are most needed.

6. Privacy Policy: We are committed to protecting your privacy. Our Privacy Policy outlines how we collect, use, and safeguard your personal information. By using our website, you consent to our Privacy Policy.

7. Third-Party Links: Our website may contain links to third-party websites. We are not responsible for the content or practices of these external sites. Accessing third-party links is at your own risk.

8. Limitation of Liability: Punjab Lit Foundation shall not be liable for any damages arising from the use or inability to use our website or any content therein.

9. Indemnification: You agree to indemnify and hold harmless Punjab Lit Foundation, its affiliates, and their respective officers, directors, employees, and agents from any claims, liabilities, damages, and expenses arising out of your use of our website or violation of these Terms and Conditions.

10. Modifications: We reserve the right to modify these Terms and Conditions at any time. Changes will be effective immediately upon posting on our website. Your continued use of the website constitutes acceptance of the revised terms.

11. Governing Law: These Terms and Conditions are governed by the laws of India. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts located in Hoshiarpur, Punjab.

12. Contact Information 

Punjab Lit Foundation SKG Natural, Tanda Road, 
Opposite Windsor Manor, Railway Road (Hoshiarpur), 
Hoshiarpur, Hoshiarpur- 146001, 
Punjab Phone: +91 78888 47575 
Email: punjablitfoundation@gmail.com`,
    },
    refund: {
      kicker: 'Policy',
      title: 'Non-Refund Policy for Punjab Lit Foundation',
      fullText: `Effective Date: March 30, 2024

1. Introduction Punjab Lit Foundation is a charitable organization that accepts donations to support its programs and initiatives. This Non-Refund Policy outlines the strict policy regarding donations made through our website.

2. No Refund Policy All donations made to Punjab Lit Foundation are final and non-refundable under any circumstances. Once processed, donations cannot be returned, reversed, or canceled. This policy is in place because donations are immediately allocated for charitable activities, projects, and administrative needs. By making a donation, you acknowledge and accept that no refunds will be issued.

3. Unauthorized Transactions If you believe your donation was made in error or without your authorization, please contact us immediately. We will investigate and take necessary actions if fraud or error is identified.

4. Contact Information For any questions or concerns regarding this Non-Refund Policy, please reach out to us at: 

Punjab Lit Foundation SKG Natural, Tanda Road, 
Opposite Windsor Manor, Railway Road (Hoshiarpur), 
Hoshiarpur, Hoshiarpur- 146001, 
Punjab Phone: +91 78888 47575 
Email: punjablitfoundation@gmail.com

5. Policy Amendments We reserve the right to modify this Non-Refund Policy at any time. Changes will be effective immediately upon posting on our website. Continued use of our services or further donations implies acceptance of the revised policy.`,
    },
  },
};

export default siteCopy;
