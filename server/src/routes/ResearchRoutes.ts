import { Router } from 'express';
import prisma from '../database';
import { Exams, Patient } from '@prisma/client';

const Filter = Router();

// Rota para obter a contagem de procedimentos realizados no mês atual
Filter.get('/procedures/count-this-month', async (req, res) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  try {
    const medicalRecords = await prisma.medicalRecord.findMany({
      where: {
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
      select: {
        clinicExam: true,
      },
    });

    const totalProcedures = medicalRecords.reduce(
      (acc: number, record: { clinicExam: Exams[] }) => acc + record.clinicExam.length,
      0
    );

    res.json({ totalProcedures });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching procedures count' });
  }
});

// Rota para obter a idade média dos pacientes atendidos no mês atual
Filter.get('/patients/average-age-this-month', async (req, res) => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    try {
        const medicalRecords = await prisma.medicalRecord.findMany({
            where: {
                date: {
                    gte: startOfMonth,
                    lte: endOfMonth,
                },
            },
            include: {
                patient: true,
            },
        });

        const uniquePatients = [...new Map(medicalRecords.map(record => [record.patient.id, record.patient])).values()];

        if (uniquePatients.length === 0) {
            return res.json({ averageAge: 0 });
        }

        const totalAge = uniquePatients.reduce((acc: number, patient: Patient) => {
            const birthDate = new Date(patient.dateOfBirth);
            let age = now.getFullYear() - birthDate.getFullYear();
            const m = now.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }
            return acc + age;
        }, 0);

        const averageAge = totalAge / uniquePatients.length;

        res.json({ averageAge });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching average age' });
    }
});

// Rota para obter a contagem de um tipo de procedimento específico nos últimos X meses
Filter.get('/procedures/count-by-type', async (req, res) => {
    const { type, months = '2' } = req.body;

    if (!type || typeof type !== 'string') {
        return res.status(400).json({ error: 'Procedure type is required' });
    }

    const examType = type.toUpperCase() as Exams;

    if (!Object.values(Exams).includes(examType)) {
        return res.status(400).json({ error: 'Invalid procedure type' });
    }

    const monthsAgo = parseInt(months as string, 10);
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);

    try {
        const medicalRecords = await prisma.medicalRecord.findMany({
            where: {
                date: {
                    gte: startDate,
                },
                clinicExam: {
                    hasSome: [examType] // Usa o valor validado vindo do body
                }
            },
        });

        res.json({ procedure: type, count: medicalRecords.length, months: monthsAgo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching procedures by type' });
    }
});

export default Filter;
