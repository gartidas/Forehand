import { RADIAN } from '../utils'

const ChartLabel = (entry: any) => {
  const radius = entry.innerRadius + (entry.outerRadius - entry.innerRadius) * 0.5
  const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN)
  const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN)

  if (entry.value !== 0)
    return (
      <text
        x={x}
        y={y}
        fill='black'
        textAnchor={x > entry.cx ? 'start' : 'end'}
        dominantBaseline='central'
      >
        {`${entry.name} (${entry.value})`}
      </text>
    )
}

export default ChartLabel
