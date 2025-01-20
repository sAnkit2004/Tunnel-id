import { NextResponse } from 'next/server'
import { spawn } from 'child_process'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// Helper function to run Python script
async function runPythonScript(scriptPath: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const process = spawn('python', [scriptPath, ...args])
    let output = ''
    let error = ''

    process.stdout.on('data', (data) => {
      output += data.toString()
    })

    process.stderr.on('data', (data) => {
      error += data.toString()
    })

    process.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`Python process exited with code ${code}: ${error}`))
      } else {
        resolve(output)
      }
    })
  })
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { action, biometricData } = data

    // Save biometric data temporarily
    const tempFilePath = path.join(process.cwd(), 'temp', 'biometric.dat')
    await mkdir(path.dirname(tempFilePath), { recursive: true })
    await writeFile(tempFilePath, Buffer.from(biometricData))

    if (action === 'register') {
      // Call Python script for registration
      const result = await runPythonScript(
        path.join(process.cwd(), 'scripts', 'register.py'),
        [tempFilePath]
      )
      return NextResponse.json({ success: true, publicKey: result })
    } else if (action === 'verify') {
      // Call Python script for verification
      const result = await runPythonScript(
        path.join(process.cwd(), 'scripts', 'verify.py'),
        [tempFilePath]
      )
      return NextResponse.json({ success: true, verified: result === 'true' })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Biometric processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process biometric data' },
      { status: 500 }
    )
  }
}

