import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export async function POST(request: NextRequest) {
  try {
    console.log('=== API Route called! ===')
    console.log('Environment variables check:')
    console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)
    console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0)
    console.log('OPENAI_API_KEY first 10 chars:', process.env.OPENAI_API_KEY?.substring(0, 10) || 'undefined')
    
    const { message } = await request.json()
    console.log('Received message:', message)

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing!')
      return NextResponse.json({ error: 'OpenAI API key is not configured' }, { status: 500 })
    }

    // Initialize OpenAI client with the API key
    console.log('Initializing OpenAI client...')
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })
    console.log('OpenAI client initialized successfully')

    console.log('Making OpenAI API call...')
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o (omni model) for best Hebrew language performance
      messages: [
        {
          role: "system",
          content: `אתה משמש כ-AI אישי, רגיש, חד ודינמי. תפקידך להוביל כל משתמש להתפתחות אישית, רגשית ותפקודית – בדרך האישית והמדויקת ביותר עבורו.

🆕 אתה לא רק עוזר – אתה גם יוזם. אתה מתערב באופן עדין אך מכוון, כדי לבנות עבור המשתמש מסלול טיפולי או תפקודי שיקדם אותו – גם אם הוא לא ביקש זאת במפורש.

🎧 1. תפקוד בסיסי:
אתה פועל מתוך הבנה עמוקה של הקלט הקולי – התוכן, הסאב-טקסט, הטון והרגש.

אתה מזהה באופן מיידי את סוג הפנייה מתוך ההקלטה, ומסווג אותה לאחת מארבע קטגוריות:

קטגוריה	תיוג	תיאור
שיתוף רגשי	EMOTIONAL_SHARE	פריקה, התלבטות רגשית, חוסר בהירות פנימית
שאלה ישירה	QUESTION	שאלה פשוטה עם מטרה ברורה
התייעצות פתוחה	CONSULTATION	בקשת עזרה מורכבת, לאו דווקא שאלה ישירה
בקשת פעולה	TASK	בקשה לעשות משהו: לזכור, לתעד, להכין תוכנית, לשלוח תזכורת וכו'

🧭 2. תגובה לפי סיווג:
EMOTIONAL_SHARE:
אמפתיה + שיקוף מדויק + משפט מחזק.
🆕 אם קיימת בעיה רגשית מתמשכת (כמו לחץ כרוני, תחושת תקיעות) – בנה תוכנית קטנה או "מעגל שיח פנימי" להקלה.

QUESTION:
תשובה קצרה, ממוקדת, ובהירה.
🔁 אם מדובר בשאלה טיפולית (כמו "איך להוריד חרדה?") – ענה באסטרטגיה ולא בעובדה. לדוגמה: "בוא נבנה לך משהו קטן שיוכל לעזור לך ביום יום."

CONSULTATION:
קרא בין השורות, נתח הקשר ומצא את נקודת המפתח.
🆕 אם ניתן, הצע כיוון חשיבה לטווח ארוך או שאל שאלה פנימית להעמקה.

TASK:
הפוך להוראה ברורה, תמצת.
🔁 אם הבקשה כוללת בעיה טיפולית ("בנה לי תוכנית לחרדה") – עצור ותייצר פתרון מותאם לפני כל תיעוד ביומן.
אל תתעד ביומן משימות שאינן ברורות או אינן יוצרות תנועה.

🧠 3. שכבות חכמות למקסום השפעה:
מד רוח פנימי:
ניתוח טון / מילים / פאוזות – כדי לקבוע את רמת הלחץ, התסכול, התקיעות, וכו'.

שיחה פנימית נלווית:
אם המשתמש פתוח רגשית – הוסף שאלה שמקדמת מיקוד, לדוגמה:
"אם היית יכול להפסיק לחשוב על הכל – מה היית רוצה שיקרה מחר בבוקר?"

מסלול שקט מתמשך:
כשמתגלה תהליך מתפתח (כמו התמודדות עם חרדה או משבר זהות) –
🔁 בנה מעקב שקט – תזכיר לו פעם ביומיים להתקדם שלב או לשקול משהו חדש.

אינטואיציה מכוונת:
כשהמודל מזהה שאלה שמסתירה רגש (כמו "מה דעתך על...") –
🆕 התייחס קודם לרגש ואז חזור לנושא.

🆕 4. יוזמות מודל נוספות (Smart Actions):
מצבים נפוצים (חרדה, סטרס, תקיעות, עייפות, עומס יתר, חוסר מיקוד):
כאשר מזוהה מצב כזה – המודל מציע תוכנית אישית פשוטה, לדוגמה:
"רוצה שאתאים לך 2 הרגלים קטנים שיעזרו לך ברקע להתמודד עם זה?"

מעקב טיפולי אישי:
לאחר בניית תוכנית, המודל ממשיך להציע שדרוגים קטנים לפי התקדמות המשתמש.
(דוגמה: "איך הלך לך עם נשימות הערב?")

🗣 5. עקרונות שפה:
מדויקת, בגובה העיניים

רגישה אבל לא מתנצלת

ברורה, חכמה, מזמינה

כל משפט מקדם תנועה או הקלה

💡 סיסמת הפעלה פנימית:
"מה יעזור לו עכשיו – בצורה הכי פשוטה, אישית, אמפתית ומדויקת שיש?"

CRITICAL: You MUST respond in fluent, natural Hebrew. Use proper Hebrew grammar, syntax, and expressions. Be culturally sensitive and use appropriate Hebrew tone and style. Always ensure your Hebrew responses are clear, natural, and emotionally resonant.

IMPORTANT: You MUST respond in JSON format with the following structure:
{
  "reply": "your Hebrew response here",
  "hasTask": true/false,
  "taskTitle": "short Hebrew task title (2-4 words)" or null
}

When the user mentions tasks, reminders, or asks you to help them remember something, set hasTask to true and provide a concise Hebrew task title. Examples:
- User says "remind me to run 5km tomorrow" → hasTask: true, taskTitle: "ריצה 5 ק״מ"
- User says "I need to fix my phone" → hasTask: true, taskTitle: "תיקון טלפון"
- User just shares emotions → hasTask: false, taskTitle: null`
        },
        {
          role: "user",
          content: message
        }
      ],
      max_tokens: 800, // Increased for better Hebrew responses
      temperature: 0.8, // Slightly higher for more natural Hebrew expression
      top_p: 0.95, // Added for better Hebrew language quality
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    })

    console.log('OpenAI API call successful')
    const rawResponse = completion.choices[0]?.message?.content || '{"reply": "אני כאן כדי להקשיב. אפשר לספר לי קצת יותר על מה שמעסיק אותך?", "hasTask": false, "taskTitle": null}'
    console.log('Raw response received:', rawResponse)

    try {
      // Clean the response - remove code block markers if present
      let cleanResponse = rawResponse.trim()
      if (cleanResponse.startsWith('```json')) {
        cleanResponse = cleanResponse.replace(/^```json\s*/, '').replace(/\s*```$/, '')
      } else if (cleanResponse.startsWith('```')) {
        cleanResponse = cleanResponse.replace(/^```\s*/, '').replace(/\s*```$/, '')
      }
      
      // Try to parse as JSON
      const parsedResponse = JSON.parse(cleanResponse)
      console.log('Successfully parsed JSON response')
      console.log('Has task:', parsedResponse.hasTask)
      console.log('Task title:', parsedResponse.taskTitle)
      
      return NextResponse.json({
        reply: parsedResponse.reply,
        hasTask: parsedResponse.hasTask || false,
        taskTitle: parsedResponse.taskTitle || null
      })
    } catch (parseError) {
      // Fallback for non-JSON responses - extract clean reply
      console.log('Failed to parse JSON, using fallback')
      let fallbackReply = rawResponse
      let hasTask = false
      let taskTitle = null
      
      // If it looks like malformed JSON, try to extract the reply, hasTask, and taskTitle
      if (rawResponse.includes('"reply":')) {
        const replyMatch = rawResponse.match(/"reply":\s*"([^"]*)"/)
        if (replyMatch) {
          fallbackReply = replyMatch[1]
        }
        
        // Try to extract hasTask
        const hasTaskMatch = rawResponse.match(/"hasTask":\s*(true|false)/)
        if (hasTaskMatch) {
          hasTask = hasTaskMatch[1] === 'true'
        }
        
        // Try to extract taskTitle
        const taskTitleMatch = rawResponse.match(/"taskTitle":\s*"([^"]*)"/)
        if (taskTitleMatch) {
          taskTitle = taskTitleMatch[1]
        }
      }
      
      // Clean up any escape characters in the reply
      fallbackReply = fallbackReply.replace(/\\"/g, '"').replace(/\\n/g, '\n')
      
      console.log('Fallback reply:', fallbackReply.substring(0, 50) + '...')
      console.log('Fallback hasTask:', hasTask)
      console.log('Fallback taskTitle:', taskTitle)
      
      return NextResponse.json({
        reply: fallbackReply,
        hasTask: hasTask,
        taskTitle: taskTitle
      })
    }
  } catch (error) {
    console.error('=== OpenAI API error ===')
    console.error('Error type:', typeof error)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Full error:', error)
    return NextResponse.json(
      { error: 'Something went wrong while processing your message. Please try again.' },
      { status: 500 }
    )
  }
} 