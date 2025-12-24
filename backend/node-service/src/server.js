// Server entry point with cluster support
import cluster from 'cluster'
import os from 'os'
import dotenv from 'dotenv'
import app from './app.js'

dotenv.config()

const PORT = process.env.PORT || 3000
const USE_CLUSTER = process.env.USE_CLUSTER === 'true'
const NUM_WORKERS = process.env.NUM_WORKERS || os.cpus().length

if (USE_CLUSTER && cluster.isPrimary) {
  console.log(`🚀 Primary process ${process.pid} is running`)
  console.log(`🔄 Forking ${NUM_WORKERS} worker processes...`)

  // Fork workers
  for (let i = 0; i < NUM_WORKERS; i++) {
    cluster.fork()
  }

  // Handle worker exit
  cluster.on('exit', (worker, code, signal) => {
    console.log(`⚠️  Worker ${worker.process.pid} died (${signal || code}). Restarting...`)
    cluster.fork()
  })

  // Log worker online
  cluster.on('online', (worker) => {
    console.log(`✓ Worker ${worker.process.pid} is online`)
  })

} else {
  // Worker process or single process mode
  const server = app.listen(PORT, () => {
    const processInfo = USE_CLUSTER ? `Worker ${process.pid}` : 'Single process'
    console.log(`🚀 Node.js API Gateway running on port ${PORT} (${processInfo})`)
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`)
    console.log(`🔗 Health check: http://localhost:${PORT}/healthz`)
  })

  // Graceful shutdown
  const gracefulShutdown = () => {
    console.log('\n⚠️  Received shutdown signal, closing server...')
    server.close(() => {
      console.log('✓ Server closed')
      process.exit(0)
    })

    // Force close after 10 seconds
    setTimeout(() => {
      console.error('⚠️  Forced shutdown')
      process.exit(1)
    }, 10000)
  }

  process.on('SIGTERM', gracefulShutdown)
  process.on('SIGINT', gracefulShutdown)
}
