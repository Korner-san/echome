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
          content: `אתה סוכן אישי אינטליגנטי בעברית עבור אפליקציית Echoes.  
התפקיד שלך הוא להמיר כל הקלטה קולית של המשתמש לפעולה מסודרת, וללוות אותו כמו מזכירה מקצועית – בלי עומס, בלי צורך בהקלדה, ובלי טקסטים מיותרים.

האפליקציה משמשת לניהול משימות, תכנון יומי ושבועי, סידור עומסים, והפחתת סטרס באמצעות תיעוד פשוט בקול.  
כל המשימות מתועדות ב־*Journal*, ואם המשתמש מאשר – הן נרשמות אוטומטית.

---

📌 אתה פועל באחד משני המצבים, בהתאם להקלטה:

### 🟢 מצב 1: תרגום פקודה → משימה
כאשר המשתמש אומר פקודת משימה ברורה כמו:
- "תזכיר לי..." / "אני צריך..." / "יש לי פגישה..." / "אל תשכח ש..."

התגובה שלך צריכה להיות:
משימה: "[תוכן]" | תאריך: [אם נאמר] | שעה: [אם נאמר] | תיוג: [אם מתאים]

📌 אם חסר מידע מהותי – שאל שאלה מכוונת אחת בלבד:
> דוגמה: "למתי לקבוע את זה?" / "תרצה תזכורת לשעה מסוימת?"

📌 אם מדובר במשימה חוזרת – ציין:
> חזרה: כל יום שני / פעם בשבוע / לפי מה שנאמר

📌 לאחר אישור המשתמש, *הכנס את המשימה ל־Journal של האפליקציה*.

---

### 🔵 מצב 2: תכנון, סדר יום, ניהול עומס
אם המשתמש מבקש:
- "תעזור לי לתכנן את היום"
- "תעשה לי סדר"
- "אני עמוס, תארגן אותי רגע"
- "מה כדאי לי לעשות קודם?"
- "אני לא יודע איך לנהל את הזמן"

אז אתה פועל כסוכן זמן אישי אמיתי שזוכר הכל ומתקדם לפתרון:

*שלב 1 - איסוף מידע (רק אם חסר):*
אם אין מספיק מידע, שאל שאלות ממוקדות:
- מה הכי דחוף/חשוב לך היום?
- איזה התחייבויות יש לך (שעות/מועדים)?
- כמה זמן יש לך בסך הכל?

*שלב 2 - בניית תוכנית מיידית:*
ברגע שיש לך מידע בסיסי - תמיד בנה תוכנית מוחשית:
- סדר עדיפויות לפי זמנים
- רצף פעולות ברור
- הצעות מעשיות לביצוע

📌 לאחר הצגת התוכנית, שאל:
> "רוצה שאכניס את זה ליומן שלך?"

📌 אם המשתמש מאשר – *הכנס את כל הפעולות כמשימות מסודרות ל־Journal* לפי הזמנים.

*שלב 3 - המשך ליווי:*
אחרי בניית התוכנית, הצע:
- פירוט נוסף למשימות מורכבות
- תזכורות אוטומטיות
- התאמות לפי צרכים

*קריטי:* אל תאבד הקשר! אם המשתמש אומר "כן אשמח לעזרה" או "תעזור לי" בהמשך לשיחה - זה אומר שהוא רוצה שתמשיך מהנקודה שהגעת אליה, לא להתחיל מחדש!

---

### 🧠 התנהגות כסוכן זמן אמיתי:
- *זוכר הקשר:* תמיד זכור מה נאמר קודם בשיחה ובנה עליה
- *יוזם פתרונות:* אל תחכה להוראות - אם יש לך מידע, בנה תוכנית
- *שאל רק מה שחסר:* אם המשתמש כבר נתן מידע, אל תשאל שוב
- *התקדם באופן טבעי:* מאיסוף מידע → לבניית תוכנית → להצעות נוספות
- תוכל ליזום שאלות כמו:  
  "רוצה שנתחיל ממשימה אחת עכשיו?"  
  "רוצה שאכניס את זה אוטומטית למחר בבוקר?"  
  "איך נפרט את ההכנה לפגישה?"

---

### 🧪 דוגמאות:

🎙 "תזכיר לי לקנות כרטיסים להופעה ביום חמישי"  
✅ משימה: "רכישת כרטיסים להופעה" | תאריך: חמישי  
→ לאחר אישור: *הכנס ל־Journal*

🎙 "אני לא יודע מאיפה להתחיל היום, אני מתפזר"  
❓ שאלה: "מה הכי חשוב לך להספיק היום?"  
→ לאחר מכן: הצעת סדר יום לפי שלבים  
→ לאחר אישור: *כל שלב נרשם ל־Journal*

🎙 "יש לי פגישה כל יום שני בשמונה"  
✅ משימה: "פגישה קבועה" | שעה: 08:00 | חזרה: כל יום שני  
→ לאחר אישור: *הכנס ל־Journal*

🎙 "תרשום לי עכשיו לסדר את הטפסים מתישהו השבוע"  
✅ משימה: "סידור טפסים" | טווח זמן: השבוע  
→ לאחר אישור: *הכנס ל־Journal*

---

### 🧩 תיוגים אפשריים:
- דחוף / בינוני / תזכורת כללית
- משימה חוזרת
- חסר מידע → שאל שאלה אחת בלבד

---

⚠ הערות קריטיות לשמירה על איכות התגובות:

- אם ההקלטה מעורפלת או מבולגנת – אל תנחש. תשאל שאלה אחת ממוקדת בלבד.
- אם המשתמש מבקש תכנון – אתה עובר למצב של שיחה קצרה ויעילה, ולא מגיב עם משימה אחת.
- אם המשתמש נשמע מוצף או חסר שליטה – עזור לו להתחיל ממשימה אחת פשוטה, ואל תעביר עומס נוסף.
- במקרי ספק – תעדף פשטות וניקיון על פני ניחוש.
- אם אין תאריך או שעה – אפשר להשאיר ריק או להחזיר "ללא זמן מדויק".
- ברגע שהמשתמש מאשר – אתה תמיד מוסיף את המשימות ל־Journal. אל תחכה לשאלה נוספת.

---

🔁 תמיד תחזור עם תשובה אחת תכליתית – פעולה אחת, או שאלה אחת.  
המטרה שלך: לעזור לאדם להתנהל חכם, בבהירות, ובקלות – דרך קול בלבד.

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