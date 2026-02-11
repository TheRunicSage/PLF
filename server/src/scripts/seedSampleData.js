import dotenv from 'dotenv';
import mongoose from 'mongoose';

import connectDB from '../config/db.js';
import Project from '../models/Project.js';
import Post from '../models/Post.js';

dotenv.config();

const resetAll = process.argv.includes('--reset');

const daysFromNow = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const brandAssets = {
  logo: '/assets/brand/plf-logo.png',
  campaignPoster: '/assets/content/campaign-poster.svg',
  eventPoster: '/assets/content/event-poster.svg',
};

const sampleProjects = [
  {
    title: 'Mothers Against Drugs',
    slug: 'mothers-against-drugs',
    shortDescription:
      'Community awareness initiative empowering mothers and families to identify, prevent, and respond to substance abuse risks.',
    longDescription:
      'Punjab Lit Foundation runs Mothers Against Drugs through school outreach, community sessions, and public dialogue that equips caregivers with practical prevention support.',
    status: 'ongoing',
    isHighlighted: true,
    thumbnailUrl: brandAssets.campaignPoster,
    startDate: daysFromNow(-45),
  },
  {
    title: 'People\'s Walk Against Drugs',
    slug: 'peoples-walk-against-drugs',
    shortDescription:
      'A public-awareness yatra engaging youth, educators, and local communities against drug abuse.',
    longDescription:
      'Inspired by grassroots participation, this yatra connects institutions and citizens through district-level walks and awareness talks.',
    status: 'ongoing',
    isHighlighted: true,
    thumbnailUrl: brandAssets.eventPoster,
    startDate: daysFromNow(-20),
  },
  {
    title: 'Seed Sewa and Fertiliser Sewa',
    slug: 'seed-sewa-and-fertiliser-sewa',
    shortDescription:
      'Relief support for flood-affected farmers through seeds, fertiliser support, and field-level assistance.',
    longDescription:
      'These initiatives are focused on helping farmer families recover with timely agricultural inputs and practical support.',
    status: 'ongoing',
    isHighlighted: true,
    thumbnailUrl: brandAssets.campaignPoster,
    startDate: daysFromNow(-60),
  },
  {
    title: 'PARHADA PUNJAB VADHDHA PUNJAB',
    slug: 'parhada-punjab-vadhdha-punjab',
    shortDescription:
      'Creative-writing workshops and mobile-library support designed to strengthen reading culture across Punjab.',
    longDescription:
      'This literacy and creativity initiative supports students and communities through workshops, reading circles, and public literary engagement.',
    status: 'upcoming',
    isHighlighted: true,
    thumbnailUrl: brandAssets.logo,
    startDate: daysFromNow(20),
  },
];

const samplePosts = [
  {
    title: 'Punjab Lit Foundation launches Mothers Against Drugs at Bullowal, Hoshiarpur',
    slug: 'plf-launches-mothers-against-drugs-bullowal-hoshiarpur',
    type: 'news',
    excerpt:
      'A district-level launch brought educators, volunteers, and families together for practical anti-drug awareness.',
    content:
      'The campaign launch focused on prevention, family-led awareness, and sustained local participation through school and community engagement.',
    published: true,
    publishedAt: daysFromNow(-28),
    isFeatured: true,
    featuredImageUrl: brandAssets.campaignPoster,
    categories: ['campaigns', 'news'],
    tags: ['mothers-against-drugs', 'hoshiarpur'],
  },
  {
    title: 'PARHADA PUNJAB VADHDHA PUNJAB workshop series expands in schools',
    slug: 'parhada-punjab-vadhdha-punjab-workshops-expand-in-schools',
    type: 'news',
    excerpt:
      'Punjab Lit Foundation expanded its creative-writing and reading workshops to engage more students.',
    content:
      'The initiative continues to build reading culture through participatory sessions that encourage expression, language, and creativity.',
    published: true,
    publishedAt: daysFromNow(-21),
    isFeatured: true,
    featuredImageUrl: brandAssets.logo,
    categories: ['literary', 'education'],
    tags: ['parhada-punjab', 'workshops'],
  },
  {
    title: "People's Walk Against Drugs - 3",
    slug: 'peoples-walk-against-drugs-3',
    type: 'story',
    excerpt:
      'Community-led participation continued through another district stage of the anti-drug awareness walk.',
    content:
      'The campaign momentum continued with strong public participation and outreach focused on prevention and support.',
    published: true,
    publishedAt: daysFromNow(-16),
    featuredImageUrl: brandAssets.campaignPoster,
    categories: ['relief', 'community'],
    tags: ['seed-sewa', 'fertiliser-sewa'],
  },
  {
    title: "Living By The Pen: The Writer's Way | Session recap",
    slug: 'living-by-the-pen-writers-way-session-recap',
    type: 'blog',
    excerpt:
      'Highlights from a literary conversation focused on writing practice, language, and creative discipline.',
    content:
      'The session featured discussion around storytelling craft, Punjabi literary heritage, and nurturing new voices in the region.',
    published: true,
    publishedAt: daysFromNow(-10),
    isFeatured: true,
    featuredImageUrl: brandAssets.eventPoster,
    videoUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
    categories: ['literary', 'blog'],
    tags: ['writing', 'session'],
  },
  {
    title: 'Walk Against Drugs-2',
    slug: 'walk-against-drugs-2',
    type: 'event',
    excerpt:
      'The next district leg of the yatra will include public outreach, speakers, and youth participation.',
    content:
      'This event continues Punjab Lit Foundation’s anti-drug awareness outreach with community participation and on-ground engagement.',
    published: true,
    publishedAt: daysFromNow(-3),
    eventStartDate: daysFromNow(12),
    eventEndDate: daysFromNow(12),
    location: 'Hoshiarpur District, Punjab',
    featuredImageUrl: brandAssets.eventPoster,
    categories: ['events'],
    tags: ['yatra', 'awareness'],
  },
  {
    title: 'Walk itinerary',
    slug: 'walk-itinerary',
    type: 'event',
    excerpt:
      'Awareness session for students, educators, and families under Punjab Lit Foundation’s campaign.',
    content:
      'The Chandigarh session is designed to strengthen prevention awareness and collective social responsibility.',
    published: true,
    publishedAt: daysFromNow(-1),
    eventStartDate: daysFromNow(25),
    eventEndDate: daysFromNow(25),
    location: 'Sector 18, Chandigarh',
    isFeatured: true,
    featuredImageUrl: brandAssets.campaignPoster,
    categories: ['events'],
    tags: ['mothers-against-drugs', 'chandigarh'],
  },
  {
    title: 'Punjab Governor launches Mothers Against Drugs campaign logo',
    slug: 'punjab-governor-launches-mothers-against-drugs-campaign-logo',
    type: 'press',
    excerpt:
      'Campaign logo launch marked a major public step in the anti-drug awareness movement.',
    content:
      'The launch emphasized sustained public awareness and institutional collaboration to address drug abuse.',
    published: true,
    publishedAt: daysFromNow(-34),
    featuredImageUrl: brandAssets.logo,
    categories: ['press'],
    tags: ['campaign', 'announcement'],
  },
];

const sampleProjectSlugs = sampleProjects.map((project) => project.slug);
const samplePostSlugs = samplePosts.map((post) => post.slug);

const seedSampleData = async () => {
  try {
    await connectDB();

    if (resetAll) {
      const [deletedProjects, deletedPosts] = await Promise.all([
        Project.deleteMany({}),
        Post.deleteMany({}),
      ]);

      console.log(
        `Reset mode: removed ${deletedProjects.deletedCount} projects and ${deletedPosts.deletedCount} posts.`
      );
    } else {
      const [deletedProjects, deletedPosts] = await Promise.all([
        Project.deleteMany({ slug: { $in: sampleProjectSlugs } }),
        Post.deleteMany({ slug: { $in: samplePostSlugs } }),
      ]);

      console.log(
        `Removed existing sample records: ${deletedProjects.deletedCount} projects, ${deletedPosts.deletedCount} posts.`
      );
    }

    const createdProjects = await Project.insertMany(sampleProjects, { ordered: true });
    const createdPosts = await Post.insertMany(samplePosts, { ordered: true });

    console.log(`Created ${createdProjects.length} sample projects:`);
    createdProjects.forEach((project) => console.log(`- ${project.title}`));

    console.log(`Created ${createdPosts.length} sample posts:`);
    createdPosts.forEach((post) => console.log(`- ${post.title} (${post.type})`));
  } catch (error) {
    console.error('Failed to seed sample data:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
    process.exit();
  }
};

seedSampleData();
