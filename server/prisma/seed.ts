import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to empty the database
async function emptyDatabase() {
  console.log('Emptying database...');
  await prisma.medicalRecord.deleteMany({});
  await prisma.healthProfessional.deleteMany({});
  await prisma.patient.deleteMany({});
  console.log('Database emptied.');
}

async function seed() {
  await emptyDatabase();
  console.log('Starting database seeding...');

  // Seed Patients
  console.log('Creating patients...');
  await prisma.patient.createMany({
    data: [
      {
        name: 'Maria Silva Santos',
        email: 'maria.silva@email.com',
        cpf: '12345678901',
        dateOfBirth: new Date('1990-03-15'),
        sex: 'FEMALE',
      },
      {
        name: 'João Pedro Oliveira',
        email: 'joao.pedro@email.com',
        cpf: '23456789012',
        dateOfBirth: new Date('1985-07-22'),
        sex: 'MALE',
      },
      {
        name: 'Ana Carolina Costa',
        email: 'ana.carolina@email.com',
        cpf: '34567890123',
        dateOfBirth: new Date('1992-11-08'),
        sex: 'FEMALE',
      },
      {
        name: 'Carlos Eduardo Lima',
        email: 'carlos.eduardo@email.com',
        cpf: '45678901234',
        dateOfBirth: new Date('1988-01-30'),
        sex: 'MALE',
      },
      {
        name: 'Fernanda Rodrigues',
        email: 'fernanda.rodrigues@email.com',
        cpf: '56789012345',
        dateOfBirth: new Date('1995-09-12'),
        sex: 'FEMALE',
      },
      {
        name: 'Roberto Carlos Souza',
        email: 'roberto.carlos@email.com',
        cpf: '67890123456',
        dateOfBirth: new Date('1975-05-18'),
        sex: 'MALE',
      },
      {
        name: 'Juliana Mendes',
        email: 'juliana.mendes@email.com',
        cpf: '78901234567',
        dateOfBirth: new Date('1993-12-03'),
        sex: 'FEMALE',
      },
      {
        name: 'Ricardo Ferreira',
        email: 'ricardo.ferreira@email.com',
        cpf: '89012345678',
        dateOfBirth: new Date('1987-04-25'),
        sex: 'MALE',
      },
      {
        name: 'Patrícia Alves',
        email: 'patricia.alves@email.com',
        cpf: '90123456789',
        dateOfBirth: new Date('1991-08-14'),
        sex: 'FEMALE',
      },
      {
        name: 'André Gonçalves',
        email: 'andre.goncalves@email.com',
        cpf: '01234567890',
        dateOfBirth: new Date('1984-06-07'),
        sex: 'MALE',
      },
       {
        name: 'Lucas Martins',
        email: 'lucas.martins@email.com',
        cpf: '11223344556',
        dateOfBirth: new Date('1994-02-19'),
        sex: 'MALE',
      },
      {
        name: 'Mariana Duarte',
        email: 'mariana.duarte@email.com',
        cpf: '22334455667',
        dateOfBirth: new Date('1989-10-05'),
        sex: 'FEMALE',
      },
      {
        name: 'Felipe Almeida',
        email: 'felipe.almeida@email.com',
        cpf: '33445566778',
        dateOfBirth: new Date('1996-07-21'),
        sex: 'MALE',
      },
      {
        name: 'Camila Nogueira',
        email: 'camila.nogueira@email.com',
        cpf: '44556677889',
        dateOfBirth: new Date('1993-03-11'),
        sex: 'FEMALE',
      },
      {
        name: 'Bruno Lopes',
        email: 'bruno.lopes@email.com',
        cpf: '55667788990',
        dateOfBirth: new Date('1982-09-28'),
        sex: 'MALE',
      },
      {
        name: 'Renata Carvalho',
        email: 'renata.carvalho@email.com',
        cpf: '66778899001',
        dateOfBirth: new Date('1990-12-15'),
        sex: 'FEMALE',
      },
      {
        name: 'Thiago Ribeiro',
        email: 'thiago.ribeiro@email.com',
        cpf: '77889900112',
        dateOfBirth: new Date('1986-04-03'),
        sex: 'MALE',
      },
      {
        name: 'Carolina Souza',
        email: 'carolina.souza@email.com',
        cpf: '88990011223',
        dateOfBirth: new Date('1997-01-09'),
        sex: 'FEMALE',
      },
      {
        name: 'Eduardo Teixeira',
        email: 'eduardo.teixeira@email.com',
        cpf: '99001122334',
        dateOfBirth: new Date('1985-08-17'),
        sex: 'MALE',
      },
      {
        name: 'Aline Batista',
        email: 'aline.batista@email.com',
        cpf: '10111213141',
        dateOfBirth: new Date('1992-05-26'),
        sex: 'FEMALE',
      },
    ],
  });

  const patients = await prisma.patient.findMany();
  console.log(`Created ${patients.length} patients`);

  // Seed Health Professionals
  console.log('Creating health professionals...');
  await prisma.healthProfessional.createMany({
    data: [
      {
        name: 'Dr. Amanda Pereira',
        email: 'dr.amanda@hospital.com',
        cro: 'CRM12345',
        position: 'Cirurgiã-Dentista',
        dateOfBirth: new Date('1982-04-20'),
        sex: 'FEMALE',
      },
      {
        name: 'Dr. Bruno Henrique',
        email: 'dr.bruno@hospital.com',
        cro: 'CRM23456',
        position: 'Clínico-Geral',
        dateOfBirth: new Date('1978-12-05'),
        sex: 'MALE',
      },
      {
        name: 'Dra. Camila Ferreira',
        email: 'dra.camila@hospital.com',
        cro: 'CRM34567',
        position: 'aluno de odontologia',
        dateOfBirth: new Date('1986-08-14'),
        sex: 'FEMALE',
      },
      {
        name: 'Dr. Diego Almeida',
        email: 'dr.diego@hospital.com',
        cro: 'CRM45678',
        position: 'auxiliar de odontologia',
        dateOfBirth: new Date('1980-10-02'),
        sex: 'MALE',
      },
      {
        name: 'Dra. Elisabete Moreira',
        email: 'dra.elisabete@hospital.com',
        cro: 'CRM56789',
        position: 'Cirurgiã-Dentista',
        dateOfBirth: new Date('1983-06-25'),
        sex: 'FEMALE',
      },
      {
        name: 'Dr. Francisco Costa',
        email: 'dr.francisco@hospital.com',
        cro: 'CRM67890',
        position: 'Clínico-Geral',
        dateOfBirth: new Date('1979-03-18'),
        sex: 'MALE',
      },
      {
        name: 'Dra. Gabriela Martins',
        email: 'dra.gabriela@hospital.com',
        cro: 'CRM78901',
        position: 'auxiliar de odontologia',
        dateOfBirth: new Date('1985-11-12'),
        sex: 'FEMALE',
      },
      {
        name: 'Dr. Henrique Silva',
        email: 'dr.henrique@hospital.com',
        cro: 'CRM89012',
        position: 'aluno de odontologia',
        dateOfBirth: new Date('1981-07-30'),
        sex: 'MALE',
      },
      {
        name: 'Dra. Isabel Rodrigues',
        email: 'dra.isabel@hospital.com',
        cro: 'CRM90123',
        position: 'Clínico-Geral',
        dateOfBirth: new Date('1984-09-22'),
        sex: 'FEMALE',
      },
      {
        name: 'Dr. José Santos',
        email: 'dr.jose@hospital.com',
        cro: 'CRM01234',
        position: 'Cirurgiã-Dentista',
        dateOfBirth: new Date('1977-01-15'),
        sex: 'MALE',
      },

    ],
  });

  const healthProfessionals = await prisma.healthProfessional.findMany();
  console.log(`Created ${healthProfessionals.length} health professionals`);

  // Seed Medical Records
  console.log('Creating medical records...');
  await prisma.medicalRecord.createMany({
    data: [
      {
        date: new Date('2024-12-01T09:00:00'),
        patientId: patients[0].id,
        doctorId: healthProfessionals[0].id,
        anamnesis: 'Paciente relata dor de dente intensa há 3 dias, principalmente ao mastigar alimentos frios. Não faz uso de medicação para dor.',
        clinicExam: ['BIOPSIA_DOS_TECIDOS_MOLES_DA_BOCA', 'RADIOGRAFIA_PERIAPICAL'],
      },
      {
        date: new Date('2024-12-02T14:30:00'),
        patientId: patients[1].id,
        doctorId: healthProfessionals[1].id,
        anamnesis: 'Paciente com sangramento gengival durante escovação há 2 semanas. Refere mau hálito matinal.',
        clinicExam: ['ORIENTACAO_DE_HIGIENE_BUCAL', 'TRATAMENTO_POR_ALTA_POTENCIA_FLUORETOS_NA_MUCOSA_ORAL'],
      },
      {
        date: new Date('2024-12-03T10:15:00'),
        patientId: patients[2].id,
        doctorId: healthProfessionals[2].id,
        anamnesis: 'Criança de 8 anos com dor no dente da frente após queda durante brincadeira. Pais relatam que o dente escureceu.',
        clinicExam: ['ADEQUACAO_DO_COMPORTAMENTO_DE_CRIANCAS', 'RADIOGRAFIA_PANORAMICA'],
      },
      {
        date: new Date('2024-12-04T16:00:00'),
        patientId: patients[3].id,
        doctorId: healthProfessionals[3].id,
        anamnesis: 'Paciente perdeu restauração do dente posterior há 1 semana. Sente sensibilidade ao frio e doce.',
        clinicExam: ['RESTAURACAO_DE_DENTE_DECIDUO_POSTERIOR_COM_RESINA_COMPOSTA', 'RADIOGRAFIA_INTERPROXIMAL_BITE_WING'],
      },
      {
        date: new Date('2024-12-05T11:45:00'),
        patientId: patients[4].id,
        doctorId: healthProfessionals[4].id,
        anamnesis: 'Consulta de rotina para limpeza. Paciente escova os dentes 2x ao dia, usa fio dental ocasionalmente.',
        clinicExam: ['ORIENTACAO_DE_HIGIENE_BUCAL', 'ORIENTACAO_DE_HIGIENIZACAO_DE_PROTESES_DENTARIAS'],
      },
      {
        date: new Date('2024-12-06T08:30:00'),
        patientId: patients[5].id,
        doctorId: healthProfessionals[5].id,
        anamnesis: 'Paciente com mobilidade dentária e retração gengival progressiva há 6 meses. Fumante há 20 anos.',
        clinicExam: ['SESSAO_DE_IMPOSICAO_DE_MAOS', 'RADIOGRAFIA_PERIAPICAL'],
      },
      {
        date: new Date('2024-12-07T15:20:00'),
        patientId: patients[6].id,
        doctorId: healthProfessionals[6].id,
        anamnesis: 'Paciente deseja clarear os dentes para casamento. Nega sensibilidade dentária prévia.',
        clinicExam: ['RESTAURACAO_DE_DENTE_PERMANENTE_ANTERIOR_COM_RESINA_COMPOSTA', 'TRATAMENTO_POR_ALTA_POTENCIA_FLUORETOS_NA_MUCOSA_ORAL'],
      },
      {
        date: new Date('2024-12-08T13:10:00'),
        patientId: patients[6].id,
        doctorId: healthProfessionals[7].id,
        anamnesis: 'Dor intensa no dente do siso há 48 horas, dificuldade para abrir a boca. Paciente com 25 anos.',
        clinicExam: ['EXCISAO_E_SUTURA_DE_LESAO_NA_BOCA', 'RADIOGRAFIA_PANORAMICA'],
      },
      {
        date: new Date('2024-12-09T10:30:00'),
        patientId: patients[8].id,
        doctorId: healthProfessionals[8].id,
        anamnesis: 'Paciente com prótese total superior desadaptada há 1 ano. Dificuldade para mastigar e falar.',
        clinicExam: ['PROTESE_TOTAL_MAXILAR', 'MOLDAGEM_DENTAL_MAXILAR_PARA_CONSTRUCAO_DE_PROTESE_DENTA'],
      },
      {
        date: new Date('2024-12-10T16:45:00'),
        patientId: patients[9].id,
        doctorId: healthProfessionals[9].id,
        anamnesis: 'Paciente com lesão esbranquiçada na lateral da língua há 3 meses. Fumante e etilista social.',
        clinicExam: ['BIOPSIA_DOS_TECIDOS_MOLES_DA_BOCA', 'RADIOGRAFIA_PERIAPICAL', 'EXCISAO_E_SUTURA_DE_LESAO_NA_BOCA'],
      },
            {
        date: new Date('2024-12-11T09:20:00'),
        patientId: patients[10].id,
        doctorId: healthProfessionals[0].id,
        anamnesis: 'Paciente com dor ao morder alimentos duros no dente inferior direito há 5 dias. Relata estalo leve ao mastigar.',
        clinicExam: ['RADIOGRAFIA_PERIAPICAL', 'RESTAURACAO_DE_DENTE_PERMANENTE_ANTERIOR_COM_RESINA_COMPOSTA'],
      },
      {
        date: new Date('2024-12-12T14:10:00'),
        patientId: patients[11].id,
        doctorId: healthProfessionals[1].id,
        anamnesis: 'Paciente com gengiva inchada e avermelhada na região anterior. Sangramento espontâneo há 3 dias.',
        clinicExam: ['ORIENTACAO_DE_HIGIENE_BUCAL', 'RADIOGRAFIA_INTERPROXIMAL_BITE_WING'],
      },
      {
        date: new Date('2024-12-13T11:05:00'),
        patientId: patients[12].id,
        doctorId: healthProfessionals[2].id,
        anamnesis: 'Paciente relata sensibilidade nos dentes superiores ao ingerir bebidas geladas, sem dor constante.',
        clinicExam: ['TRATAMENTO_POR_ALTA_POTENCIA_FLUORETOS_NA_MUCOSA_ORAL', 'RADIOGRAFIA_INTERPROXIMAL_BITE_WING'],
      },
      {
        date: new Date('2025-04-14T15:50:00'),
        patientId: patients[13].id,
        doctorId: healthProfessionals[2].id,
        anamnesis: 'Criança de 6 anos com dente de leite quebrado após queda no parquinho. Sem dor no momento.',
        clinicExam: ['ADEQUACAO_DO_COMPORTAMENTO_DE_CRIANCAS', 'RADIOGRAFIA_PANORAMICA'],
      },
      {
        date: new Date('2025-06-12T08:45:00'),
        patientId: patients[14].id,
        doctorId: healthProfessionals[4].id,
        anamnesis: 'Paciente busca avaliação para colocação de prótese parcial removível. Relata perda de dentes posteriores.',
        clinicExam: ['MOLDAGEM_DENTAL_MAXILAR_PARA_CONSTRUCAO_DE_PROTESE_DENTA', 'ORIENTACAO_DE_HIGIENIZACAO_DE_PROTESES_DENTARIAS'],
      },
      {
        date: new Date('2025-03-16T10:40:00'),
        patientId: patients[15].id,
        doctorId: healthProfessionals[5].id,
        anamnesis: 'Dor latejante em dente molar superior há 2 dias, piora à noite. Paciente fez canal no mesmo dente há 1 ano.',
        clinicExam: ['RADIOGRAFIA_PERIAPICAL', 'BIOPSIA_DOS_TECIDOS_MOLES_DA_BOCA'],
      },
      {
        date: new Date('2025-04-17T13:55:00'),
        patientId: patients[16].id,
        doctorId: healthProfessionals[7].id,
        anamnesis: 'Paciente deseja avaliação para clareamento dental. Relata manchas amareladas desde a adolescência.',
        clinicExam: ['TRATAMENTO_POR_ALTA_POTENCIA_FLUORETOS_NA_MUCOSA_ORAL', 'ORIENTACAO_DE_HIGIENE_BUCAL'],
      },
      {
        date: new Date('2024-12-18T09:35:00'),
        patientId: patients[17].id,
        doctorId: healthProfessionals[7].id,
        anamnesis: 'Paciente com dor e inchaço na gengiva ao redor do dente siso inferior esquerdo há 4 dias.',
        clinicExam: ['EXCISAO_E_SUTURA_DE_LESAO_NA_BOCA', 'RADIOGRAFIA_PANORAMICA'],
      },
      {
        date: new Date('2025-05-08T16:25:00'),
        patientId: patients[18].id,
        doctorId: healthProfessionals[8].id,
        anamnesis: 'Paciente relata prótese inferior instável, causando feridas na gengiva durante a mastigação.',
        clinicExam: ['PROTESE_TOTAL_MAXILAR', 'ORIENTACAO_DE_HIGIENIZACAO_DE_PROTESES_DENTARIAS'],
      },
      {
        date: new Date('2025-10-07T11:15:00'),
        patientId: patients[19].id,
        doctorId: healthProfessionals[9].id,
        anamnesis: 'Lesão avermelhada na mucosa jugal direita há 2 meses. Paciente é fumante e bebe socialmente.',
        clinicExam: ['BIOPSIA_DOS_TECIDOS_MOLES_DA_BOCA', 'RADIOGRAFIA_PERIAPICAL'],
      },
    ],
  });

  const medicalRecords = await prisma.medicalRecord.findMany();
  console.log(`Created ${medicalRecords.length} medical records`);
  console.log('Database seeding completed successfully!');
}

seed().then(() => {
  console.log('Database successfully seeded');
  prisma.$disconnect();
});
