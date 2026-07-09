import React from 'react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const FinancialChart = ({ financialData }) => {
  // Generate sample data based on available financial metrics
  const labels = ['Q1', 'Q2', 'Q3', 'Q4']
  
  // Use actual data if available, otherwise generate sample data
  const revenueData = financialData?.RevenueTTM 
    ? [
        parseFloat(financialData.RevenueTTM) * 0.22,
        parseFloat(financialData.RevenueTTM) * 0.24,
        parseFloat(financialData.RevenueTTM) * 0.26,
        parseFloat(financialData.RevenueTTM) * 0.28
      ]
    : [100, 120, 115, 140]

  const profitData = financialData?.ProfitMargin
    ? revenueData.map(r => r * (parseFloat(financialData.ProfitMargin) / 100))
    : [20, 25, 22, 30]

  const data = {
    labels,
    datasets: [
      {
        label: 'Revenue (Millions)',
        data: revenueData.map(v => v / 1000000),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Profit (Millions)',
        data: profitData.map(v => v / 1000000),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'rgb(148, 163, 184)',
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: 'rgb(148, 163, 184)',
        },
      },
      x: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: 'rgb(148, 163, 184)',
        },
      },
    },
  }

  return (
    <div style={{ height: '300px' }}>
      <Line data={data} options={options} />
    </div>
  )
}

export default FinancialChart
