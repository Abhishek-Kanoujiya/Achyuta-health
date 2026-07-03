const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcrypt');
const prisma = new PrismaClient();

const doctorsList = [
  { name: "Dr. Alan Grant", spec: "Paleontologist / General Surgeon" },
  { name: "Dr. Ellie Sattler", spec: "Paleobotanist / General Practice" },
  { name: "Dr. Ian Malcolm", spec: "Chaos Theory / Neurologist" },
  { name: "Dr. Sarah Harding", spec: "Behavioral Sciences" },
  { name: "Dr. Gregory House", spec: "Diagnostic Medicine" },
  { name: "Dr. James Wilson", spec: "Oncology" },
  { name: "Dr. Lisa Cuddy", spec: "Endocrinology" },
  { name: "Dr. Allison Cameron", spec: "Immunology" },
  { name: "Dr. Robert Chase", spec: "Intensive Care" },
  { name: "Dr. Eric Foreman", spec: "Neurology" },
  { name: "Dr. Meredith Grey", spec: "General Surgery" },
  { name: "Dr. Derek Shepherd", spec: "Neurosurgery" },
  { name: "Dr. Cristina Yang", spec: "Cardiothoracic Surgery" },
  { name: "Dr. Alex Karev", spec: "Pediatric Surgery" },
  { name: "Dr. Miranda Bailey", spec: "General Surgery" },
  { name: "Dr. Richard Webber", spec: "General Surgery" },
  { name: "Dr. Owen Hunt", spec: "Trauma Surgery" },
  { name: "Dr. Arizona Robbins", spec: "Pediatric Surgery" },
  { name: "Dr. Callie Torres", spec: "Orthopedic Surgery" },
  { name: "Dr. Mark Sloan", spec: "Plastic Surgery" }
];

async function main() {
  const pw = await hash('password', 10);
  
  // Seed admin
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'System Admin',
      password: pw,
      role: 'ADMIN'
    }
  });

  // Seed original doctor
  await prisma.user.upsert({
    where: { email: 'doctor@example.com' },
    update: {},
    create: {
      email: 'doctor@example.com',
      name: 'Dr. Sarah Smith',
      password: pw,
      role: 'DOCTOR',
      doctorProfile: {
        create: {
          specialization: 'Cardiologist',
          workingHours: 'Mon-Fri 9AM-5PM',
          slotDuration: 30
        }
      }
    }
  });

  // Seed 20 dummy doctors
  for (let i = 0; i < doctorsList.length; i++) {
    const doc = doctorsList[i];
    const email = `doctor${i+2}@example.com`;
    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        name: doc.name,
        password: pw,
        role: 'DOCTOR',
        doctorProfile: {
          create: {
            specialization: doc.spec,
            workingHours: 'Mon-Fri 9AM-5PM',
            slotDuration: 30
          }
        }
      }
    });
  }

  console.log("Live DB Seed Complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
