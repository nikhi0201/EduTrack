import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const SUBJECTS = ['Telugu', 'Hindi', 'English', 'Social Studies'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June'];
const CLASSES = ['Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

const FIRST_NAMES = [
  'Rahul', 'Priya', 'Ananya', 'Vikram', 'Sneha', 'Aarav', 'Ishita', 'Rohan', 'Kirti', 'Aditya',
  'Sai', 'Divya', 'Kavya', 'Siddharth', 'Meera', 'Arjun', 'Tanvi', 'Manish', 'Neha', 'Varun',
  'Pooja', 'Karan', 'Rutuja', 'Deepak', 'Swati', 'Harish', 'Bhavna', 'Nikhil', 'Shruti', 'Aakash',
  'Gautam', 'Shweta', 'Rajesh', 'Ankita', 'Nitin', 'Rashi', 'Ganesh', 'Monika', 'Sunil', 'Preeti',
  'Sandeep', 'Nisha', 'Rakesh', 'Pallavi', 'Vijay', 'Shreya', 'Amit', 'Richa', 'Abhishek', 'Komal',
  'Vishal', 'Sonam', 'Pankaj', 'Suman', 'Dheeraj', 'Juhi', 'Prashant', 'Simran', 'Tarun', 'Poonam',
  'Saurabh', 'Reena', 'Yash', 'Anjali', 'Mayank', 'Kusum', 'Ashish', 'Neeta', 'Hemant', 'Jyoti',
  'Alok', 'Ritu', 'Vivek', 'Seema', 'Chirag', 'Deepika', 'Suraj', 'Rashmi', 'Manoj', 'Payal',
  'Kiran', 'Sheetal', 'Devendra', 'Kavita', 'Sanjay', 'Sangeeta', 'Mahesh', 'Sonal', 'Lokesh', 'Priyanka',
  'Ramesh', 'Aarti', 'Mukesh', 'Archana', 'Dinesh', 'Vandana', 'Naresh', 'Surbhi', 'Umesh', 'Tanya'
];

const LAST_NAMES = [
  'Sharma', 'Verma', 'Gupta', 'Patel', 'Reddy', 'Rao', 'Nair', 'Joshi', 'Mehta', 'Kumar',
  'Pillai', 'Singhal', 'Chawla', 'Deshmukh', 'Kulkarni', 'Iyer', 'Menon', 'Bhat', 'Shetty', 'Gowda',
  'Tiwari', 'Pandey', 'Mishra', 'Tripathi', 'Saxena', 'Agarwal', 'Bansal', 'Goyal', 'Kapoor', 'Malhotra'
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function clamp(val: number, min = 0, max = 100): number {
  return Math.min(Math.max(Math.round(val), min), max);
}

async function main() {
  console.log('🌱 Starting database seeding for EduTrack...');

  // 1. Clean existing records
  await prisma.mark.deleteMany();
  await prisma.student.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.admin.deleteMany();

  // 2. Create Admin user
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'password123';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.admin.create({
    data: {
      username: adminUsername,
      password_hash: passwordHash,
    },
  });
  console.log(`✅ Admin account created: ${admin.username}`);

  // 3. Create Subjects
  const subjectMap = new Map<string, string>();
  for (const name of SUBJECTS) {
    const sub = await prisma.subject.create({
      data: { subject_name: name },
    });
    subjectMap.set(name, sub.id);
  }
  console.log(`✅ Created ${SUBJECTS.length} subjects.`);

  // 4. Create Assignments (Months)
  const monthMap = new Map<string, string>();
  for (const m of MONTHS) {
    const asgn = await prisma.assignment.create({
      data: { month: m },
    });
    monthMap.set(m, asgn.id);
  }
  console.log(`✅ Created ${MONTHS.length} monthly assignments.`);

  // 5. Generate 100+ Students & Marks
  const studentsToCreate = 105;
  const markRecordsToInsert: Array<{
    student_id: string;
    subject_id: string;
    assignment_id: string;
    marks: number;
  }> = [];

  console.log(`Generating ${studentsToCreate} realistic student records...`);

  for (let i = 0; i < studentsToCreate; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[i % LAST_NAMES.length];
    const fullName = `${firstName} ${lastName}`;
    const age = 13 + (i % 5); // 13 to 17
    const currentClass = CLASSES[i % CLASSES.length];

    const student = await prisma.student.create({
      data: {
        name: fullName,
        age,
        current_class: currentClass,
      },
    });

    // Profile type for realistic analytics variation
    // 0: Consistent High Performer (85-98)
    // 1: Rapid Improver (Jan: 45 -> Jun: 88)
    // 2: Declining Performance (Jan: 85 -> Jun: 48)
    // 3: Language Specialist (High Telugu & Hindi, moderate others)
    // 4: Social/English Specialist (High English & Social Studies)
    // 5: Student Needing Attention (Overall < 50)
    // 6: Average Steady Performer (60-75)
    const profileType = i % 7;

    for (const subjectName of SUBJECTS) {
      const subjectId = subjectMap.get(subjectName)!;

      // Base skill for this subject
      let baseSkill = 65;
      if (profileType === 0) baseSkill = 88;
      else if (profileType === 3) baseSkill = (subjectName === 'Telugu' || subjectName === 'Hindi') ? 85 : 58;
      else if (profileType === 4) baseSkill = (subjectName === 'English' || subjectName === 'Social Studies') ? 88 : 55;
      else if (profileType === 5) baseSkill = 42;
      else if (profileType === 6) baseSkill = 68;

      for (let mIdx = 0; mIdx < MONTHS.length; mIdx++) {
        const monthName = MONTHS[mIdx];
        const assignmentId = monthMap.get(monthName)!;

        let markVal = baseSkill;

        // Apply month progression delta
        if (profileType === 1) {
          // Improver (+6 to +8 per month)
          markVal += mIdx * 7.5 - 15;
        } else if (profileType === 2) {
          // Decliner (-6 to -8 per month)
          markVal -= mIdx * 7.5;
        } else {
          // Slight month to month fluctuation
          markVal += Math.sin(mIdx + i) * 5;
        }

        // Add small random noise (-3 to +3)
        const noise = (Math.random() * 6) - 3;
        markVal = clamp(markVal + noise, 15, 100);

        markRecordsToInsert.push({
          student_id: student.id,
          subject_id: subjectId,
          assignment_id: assignmentId,
          marks: markVal,
        });
      }
    }
  }

  // Batch insert mark records
  await prisma.mark.createMany({
    data: markRecordsToInsert,
  });

  console.log(`✅ Created ${studentsToCreate} students and ${markRecordsToInsert.length} marks records.`);
  console.log('🚀 Seeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
