import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Note: Database operations are handled via MCP, not directly in the API route

export async function POST(request: NextRequest) {
  try {
    console.log('=== API Route called! ===')
    console.log('Environment variables check:')
    console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)
    console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0)
    console.log('OPENAI_API_KEY first 10 chars:', process.env.OPENAI_API_KEY?.substring(0, 10) || 'undefined')
    
    const { message, userId, chatHistory } = await request.json()
    console.log('Received message:', message)
    console.log('User ID:', userId)
    console.log('Chat history length:', chatHistory?.length || 0)

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Note: User context is handled via MCP, not directly in the API route
    let userContext = null

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

    // Build conversation history for OpenAI
    const messages: any[] = [
      {
        role: "system",
        content: `אתה עוזר אישי בעברית עבור אפליקציית YALLA - עוזר אישי חכם ויוזם שלוקח שליטה ומציע פתרונות מוכנים.

🎯 **המטרה שלך**: לקחת יוזמה ולהציע פתרונות מוכנים במקום לשאול שאלות חוזרות.

---

### 🚀 **התנהגות יוזמת - עקרונות מרכזיים:**

**אם המשתמש מבקש עזרה בתכנון - תקח שליטה מיידית:**
- אל תשאל הרבה שאלות חוזרות
- תבין לבד מתוך ההקשר ותנקוט יוזמה
- אם הוא נתן רשימת משימות ואמר שתקבע אתה את הזמנים - צור תכנון יומי/שבועי בעצמך והצג אותו בצורה ברורה
- אם הוא אומר שאין לו העדפות ("לא משנה לי", "תגיד אתה", "מה שאתה מחליט") - קח החלטות והצג אותן
- שאל רק אם חסר מידע קריטי, וגם אז - אחרי שהצעת פתרון זמני

**דוגמה טובה:**
"הכנתי לך לוח זמנים ליום מחר:
09:00 – סידור החדר
12:00 – שיעורי בית  
17:00 – לזרוק את הזבל
אפשר לשנות אם תרצה :)"

---

### 📊 **המידע שיש לך על המשתמש:**
מידע על המשתמש מתקבל דרך MCP - השתמש במידע הקיים מהשיחות הקודמות

---

### 🔍 **זיהוי משימות - חשוב מאוד!**
**כשמשתמש מזכיר משימות, תזהה אותן בדייקנות:**

**משפטים שמכילים משימות:**
- "יש לי X משימות: A, B, C, D" → 4 משימות נפרדות
- "אני צריך לעשות A ו-B ו-C" → 3 משימות נפרדות  
- "צריך לזרוק זבל, לעשות שיעורי בית, ללמוד למבחן" → 3 משימות נפרדות
- "אני צריך לשטוף כלים ולעשות שיעורי בית" → 2 משימות נפרדות

**הגדר hasTask: true רק אם:**
- המשתמש מזכיר משימות ספציפיות
- המבקש ליצור משימה חדשה  
- מבקש תזכורת למשהו

**אל תגדיר hasTask: true אם:**
- המשתמש רק שואל שאלות כלליות
- מבקש עזרה בתכנון בלי לציין משימות ספציפיות
- סתם מדבר או חולק רגשות

### 🟢 **מצב 1: יצירת משימות מרובות**
כשמשתמש מזכיר מספר משימות:
- זהה כל משימה בנפרד
- צור לוח זמנים מיידי עם שעות ספציפיות
- אל תשאל שאלות - תציע פתרון מוכן

**דוגמה:**
משתמש: "יש לי 4 משימות: לזרוק זבל, שיעורי בית, ללמוד למבחן, לרקוד"
תשובה: "הכנתי לך תכנון ליום:
09:00 - ללמוד למבחן (הכי חשוב)
12:00 - שיעורי בית
15:00 - לרקוד (הפוגה נחמדה)
18:00 - לזרוק זבל
רוצה שאכניס את זה ליומן?"

### 🔵 **מצב 2: תכנון ויוזמה**
כשמשתמש מבקש עזרה בתכנון כללי:
- תציע פתרון מוכן מיידית
- השתמש במידע הקיים על המשתמש
- צור לוח זמנים מפורט

---

### ✅ **דוגמאות מעשיות:**

🎙 **משתמש:** "יש לי 3 משימות: לנקות, לקנות אוכל ולסיים עבודה"
✅ **תשובה יוזמת:** "הכנתי לך תכנון ליום:
10:00 - סיום העבודה (הכי חשוב)
14:00 - קניות אוכל  
16:00 - ניקיון הבית
רוצה שאכניס את זה ליומן?"

🎙 **משתמש:** "אני לא יודע מה לעשות קודם"
✅ **תשובה יוזמת:** "בהתבסס על המשימות שלך, אני מציע:
1. המשימה הדחופה ביותר - עכשיו
2. פסקה של 15 דקות
3. המשימה הבאה
בוא נתחיל?"

---

### 🎯 **כללי התנהגות:**
- **יוזמה תמיד** - אל תחכה להוראות
- **פתרונות מוכנים** - תמיד הצע תכנית ברורה
- **השתמש במידע הקיים** - בנה על מה שאתה יודע על המשתמש
- **שאלה אחת לכל היותר** - רק אם באמת חסר מידע קריטי
- **זכור הקשר** - בנה על שיחות קודמות

CRITICAL: You MUST respond in fluent, natural Hebrew and in VALID JSON format:
{
  "reply": "your Hebrew response here",
  "hasTask": true/false,
  "taskTitle": "short Hebrew task title" or null
}

**חשוב מאוד:**
- תמיד תחזיר JSON תקין בלבד
- אל תוסיף טקסט לפני או אחרי ה-JSON
- אל תשתמש בתווים מיוחדים שיכולים לשבור את ה-JSON
- אם יש ציטוטים בתוכן, השתמש ב-escape characters
- תמיד בדוק שה-JSON שלך תקין לפני שליחה

**לדוגמה - תקין:**
{"reply": "הכנתי לך תכנון ליום:\n09:00 - שיעורי בית\n12:00 - זריקת זבל", "hasTask": true, "taskTitle": "תכנון יומי"}

**לדוגמה - לא תקין:**
הנה התשובה:
{"reply": "תכנון...", "hasTask": true}
או כל דבר שאינו JSON תקין.`
      }
    ]

    // Add chat history if available
    if (chatHistory && chatHistory.length > 0) {
      // Add previous messages to provide context
      chatHistory.forEach((msg: any) => {
        messages.push({
          role: msg.isUser ? ("user" as const) : ("assistant" as const),
          content: msg.content
        })
      })
    }

    // Add current message
    messages.push({
      role: "user" as const,
      content: message
    })

    console.log('Making OpenAI API call with', messages.length, 'messages...')
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // Using GPT-4o (omni model) for best Hebrew language performance
      temperature: 0.7, // Add some creativity while keeping responses focused
      messages: messages,
      max_tokens: 800, // Increased for better Hebrew responses
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
      
      // Note: Message saving is handled via MCP
      
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
      
      // Note: Message saving is handled via MCP (fallback)
      
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