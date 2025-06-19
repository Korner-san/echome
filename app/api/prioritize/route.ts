import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface Task {
  id: string
  title: string
  content: string
  urgency: string
  date: string
  completed: boolean
}

interface PrioritizedTask {
  id: string
  newUrgency: 'מאוד חשוב' | 'חשוב' | 'אפשר לחכות' | 'מתי שתרצה'
  reasoning: string
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== Prioritize API Route called! ===')
    
    const { tasks } = await request.json()
    console.log('Received tasks for prioritization:', tasks)

    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
      return NextResponse.json({ error: 'No tasks provided' }, { status: 400 })
    }

    // Prepare tasks data for ChatGPT
    const tasksForAnalysis = tasks.map((task: Task) => ({
      id: task.id,
      title: task.title || 'ללא כותרת',
      content: task.content || 'ללא תיאור',
      currentUrgency: task.urgency
    }))

    const prompt = `אתה מומחה בניהול זמן ותעדוף משימות. אני אשלח לך רשימת משימות עם הכותרות והתיאורים שלהן.
עליך לנתח כל משימה ולקבוע את רמת הדחיפות שלה על פי הקריטריונים הבאים:

רמות דחיפות:
- "מאוד חשוב" - משימות עם דדליין קרוב, משימות קריטיות לעבודה/בריאות/בטיחות
- "חשוב" - משימות חשובות אבל לא דחופות, יש זמן אבל לא כדאי לדחות
- "אפשר לחכות" - משימות שניתן לדחות ללא השלכות משמעותיות
- "מתי שתרצה" - משימות נחמדות לעשות אבל לא הכרחיות

קריטריונים לבחינה:
1. דדליינים וזמנים קבועים
2. השפעה על אחרים
3. השלכות של דחייה
4. חשיבות לטווח ארוך
5. רמת מורכבות וזמן נדרש

המשימות:
${tasksForAnalysis.map((task, index) => 
  `${index + 1}. ID: ${task.id}
     כותרת: ${task.title}
     תיאור: ${task.content}
     דחיפות נוכחית: ${task.currentUrgency}`
).join('\n\n')}

החזר תשובה בפורמט JSON בלבד:
{
  "prioritizedTasks": [
    {
      "id": "task_id",
      "newUrgency": "רמת_דחיפות_חדשה",
      "reasoning": "הסבר קצר למה בחרת ברמה הזו"
    }
  ]
}`

    console.log('Making OpenAI API call for prioritization...')
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "אתה מומחה בניהול זמן ותעדוף משימות. תמיד תחזיר תשובה בפורמט JSON תקין."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    })

    const responseText = completion.choices[0].message.content
    console.log('Raw prioritization response:', responseText)

    if (!responseText) {
      throw new Error('No response from OpenAI')
    }

    // Parse the JSON response
    let prioritizedTasks: PrioritizedTask[]
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (!jsonMatch) {
        throw new Error('No JSON found in response')
      }
      
      const parsedResponse = JSON.parse(jsonMatch[0])
      prioritizedTasks = parsedResponse.prioritizedTasks
      
      if (!Array.isArray(prioritizedTasks)) {
        throw new Error('prioritizedTasks is not an array')
      }
      
      console.log('Successfully parsed prioritized tasks:', prioritizedTasks)
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError)
      return NextResponse.json({ error: 'Failed to parse prioritization response' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      prioritizedTasks
    })

  } catch (error) {
    console.error('Error in prioritize API:', error)
    return NextResponse.json(
      { error: 'Failed to prioritize tasks' },
      { status: 500 }
    )
  }
} 