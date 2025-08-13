import { Router } from 'express';
import prisma from '../database';
import { Exams, Patient } from '@prisma/client';

const Filter = Router();

// Rota para obter a contagem de procedimentos realizados no mês atual (daily breakdown)
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
        date: true,
        clinicExam: true,
      },
    });

    // Group procedures by day
    const dailyProcedures: { [day: number]: number } = {};
    const daysInMonth = endOfMonth.getDate();

    // Initialize all days with 0
    for (let day = 1; day <= daysInMonth; day++) {
      dailyProcedures[day] = 0;
    }

    // Count procedures per day
    medicalRecords.forEach(record => {
      const day = record.date.getDate();
      dailyProcedures[day] += record.clinicExam.length;
    });

    // Convert to array format for frontend
    const dailyData = Object.entries(dailyProcedures).map(([day, count]) => ({
      day: parseInt(day),
      count
    }));

    const totalProcedures = medicalRecords.reduce(
      (acc: number, record: { clinicExam: Exams[] }) => acc + record.clinicExam.length,
      0
    );

    res.json({ 
      totalProcedures,
      dailyProcedures: dailyData 
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching procedures count' });
  }
});

// Rota para obter a idade média dos pacientes atendidos no mês atual (with individual ages)
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
            return res.json({ 
                averageAge: 0,
                patientAges: []
            });
        }

        // Calculate individual ages and create chart data
        const patientAges = uniquePatients.map((patient: Patient, index: number) => {
            const birthDate = new Date(patient.dateOfBirth);
            let age = now.getFullYear() - birthDate.getFullYear();
            const m = now.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
                age--;
            }
            return {
                patient: index + 1, // Chart-friendly patient number
                age: age,
                name: patient.name // Optional: for tooltip
            };
        });

        const totalAge = patientAges.reduce((acc, p) => acc + p.age, 0);
        const averageAge = totalAge / patientAges.length;

        res.json({ 
            averageAge,
            patientAges: patientAges
        });
    } catch (error) {
        res.status(500).json({ error: 'Error fetching average age' });
    }
});

// Rota para obter a contagem e os detalhes de um tipo de procedimento específico nos últimos X meses
Filter.get('/procedures/details-by-type', async (req, res) => {
    const { type, months } = req.query;

    if (!type || typeof type !== 'string') {
        return res.status(400).json({ error: 'Procedure type is required' });
    }

    const examType = type.toUpperCase() as Exams;

    if (!Object.values(Exams).includes(examType)) {
        return res.status(400).json({ error: 'Invalid procedure type' });
    }

    const monthsAgo = parseInt(months as string, 10);
    if (isNaN(monthsAgo)) {
        return res.status(400).json({ error: 'Months must be a number' });
    }
    
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - monthsAgo, 1);

    try {
        const medicalRecords = await prisma.medicalRecord.findMany({
            where: {
                date: {
                    gte: startDate,
                },
                clinicExam: {
                    has: examType
                }
            },
            include: {
                patient: true
            }
        });

        res.json({ 
            procedureType: type, 
            count: medicalRecords.length, 
            months: monthsAgo,
            records: medicalRecords 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching procedures by type' });
    }
});

export default Filter;
