import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(req: Request) {
  try {
    const { message } = await req.json()

    // Execute the Python script with the message as an argument
    const { stdout, stderr } = await execAsync(`python main.py "${message}"`)

    if (stderr) {
      console.error('Python script error:', stderr)
      return NextResponse.json({ error: 'Failed to process message' }, { status: 500 })
    }

    // Parse the output from the Python script
    const [prediction, probability] = stdout.trim().split('|')

    return NextResponse.json({ prediction, probability: parseFloat(probability) })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}