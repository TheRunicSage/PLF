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

const sampleProjects = [
  {
    title: 'Mothers Against Drugs',
    slug: 'mothers-against-drugs',
    shortDescription:
      'A community-led awareness campaign that equips families to prevent substance abuse.',
    longDescription:
      'This initiative connects mothers, teachers, and volunteers through workshops and local outreach to reduce drug abuse at the neighborhood level.',
    status: 'ongoing',
    isHighlighted: true,
    startDate: daysFromNow(-45),
  },
  {
    title: 'People\'s Walk Against Drugs',
    slug: 'peoples-walk-against-drugs',
    shortDescription:
      'Public awareness marches to engage citizens and youth against drug addiction.',
    longDescription:
      'The walk brings together schools, local groups, and civic voices to spread anti-drug awareness across multiple towns.',
    status: 'ongoing',
    isHighlighted: true,
    startDate: daysFromNow(-20),
  },
  {
    title: 'Seed Sewa',
    slug: 'seed-sewa',
    shortDescription:
      'Distribution of quality seeds and guidance for small and marginal farmers.',
    longDescription:
      'Seed Sewa supports farmer families with seed kits, practical sessions, and local support networks to improve agricultural resilience.',
    status: 'upcoming',
    isHighlighted: true,
    startDate: daysFromNow(10),
  },
  {
    title: 'Fertiliser Sewa',
    slug: 'fertiliser-sewa',
    shortDescription:
      'Assistance program to provide timely fertiliser access and usage guidance.',
    longDescription:
      'The program helps improve crop outcomes by connecting farmers to resources and safe, efficient fertiliser usage practices.',
    status: 'upcoming',
    isHighlighted: false,
    startDate: daysFromNow(20),
  },
];

const samplePosts = [
  {
    title: 'Foundation Launches New Community Awareness Drive',
    slug: 'foundation-launches-new-community-awareness-drive',
    type: 'news',
    excerpt:
      'A citywide campaign has been launched to build stronger anti-drug awareness in local communities.',
    content:
      'Punjab Lit Foundation has launched a community awareness drive with volunteers and partner institutions focused on youth safety and prevention.',
    published: true,
    publishedAt: daysFromNow(-12),
    isFeatured: true,
    categories: ['campaigns'],
    tags: ['awareness', 'community'],
  },
  {
    title: 'Volunteer Story: Building Trust Through Local Meetings',
    slug: 'volunteer-story-building-trust-through-local-meetings',
    type: 'story',
    excerpt:
      'One volunteer shares how weekly meetings are helping families open difficult conversations.',
    content:
      'Through regular street-level meetings, volunteers are creating trusted spaces where families discuss prevention, recovery, and support.',
    published: true,
    publishedAt: daysFromNow(-9),
    categories: ['stories'],
    tags: ['volunteer', 'community'],
  },
  {
    title: 'How Community Partnerships Strengthen Anti-Drug Action',
    slug: 'how-community-partnerships-strengthen-anti-drug-action',
    type: 'blog',
    excerpt:
      'Collaboration with schools and local groups can amplify impact and continuity.',
    content:
      'Long-term results come from coordinated action. This note outlines practical steps for schools, local councils, and citizen groups to work together.',
    published: true,
    publishedAt: daysFromNow(-5),
    isFeatured: true,
    categories: ['insights'],
    tags: ['partnerships', 'strategy'],
  },
  {
    title: 'Upcoming Event: Youth Awareness Rally - Ludhiana',
    slug: 'upcoming-event-youth-awareness-rally-ludhiana',
    type: 'event',
    excerpt:
      'Join our youth awareness rally focused on prevention, support, and public engagement.',
    content:
      'This event includes a public march, speakers, and awareness material distribution with local volunteers and schools.',
    published: true,
    publishedAt: daysFromNow(-1),
    eventStartDate: daysFromNow(7),
    eventEndDate: daysFromNow(7),
    location: 'Ludhiana, Punjab',
    categories: ['events'],
    tags: ['youth', 'rally'],
  },
  {
    title: 'Upcoming Event: Mothers Against Drugs Workshop',
    slug: 'upcoming-event-mothers-against-drugs-workshop',
    type: 'event',
    excerpt:
      'A practical workshop for mothers and caregivers on early warning signs and support pathways.',
    content:
      'The workshop covers prevention, communication at home, and how to connect with local support systems.',
    published: true,
    publishedAt: new Date(),
    eventStartDate: daysFromNow(14),
    eventEndDate: daysFromNow(14),
    location: 'Jalandhar, Punjab',
    isFeatured: true,
    categories: ['events'],
    tags: ['workshop', 'mothers'],
  },
  {
    title: 'Press Note: Campaign Milestone Reached',
    slug: 'press-note-campaign-milestone-reached',
    type: 'press',
    excerpt:
      'The campaign has reached key participation milestones across districts.',
    content:
      'Punjab Lit Foundation acknowledges the support of volunteers and community institutions for helping reach campaign participation goals.',
    published: true,
    publishedAt: daysFromNow(-2),
    categories: ['press'],
    tags: ['milestone'],
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
