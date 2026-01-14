import json
import os
import psycopg2
from typing import Optional

def handler(event: dict, context) -> dict:
    '''API для работы с чатом: авторизация, отправка сообщений, получение истории'''
    method = event.get('httpMethod', 'GET')
    
    # CORS для всех запросов
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    }
    
    if method == 'OPTIONS':
        return {'statusCode': 200, 'headers': cors_headers, 'body': ''}
    
    try:
        # Подключение к БД
        db_url = os.environ['DATABASE_URL']
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        query_params = event.get('queryStringParameters') or {}
        action = query_params.get('action', '')
        
        if method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            if action == 'register':
                # Регистрация/авторизация пользователя
                email = body.get('email', '').strip().lower()
                
                if not email or '@' not in email:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Invalid email'})
                    }
                
                # Проверяем существование пользователя
                cur.execute("SELECT id FROM chat_users WHERE email = %s", (email,))
                user = cur.fetchone()
                
                if not user:
                    # Создаём нового пользователя
                    cur.execute(
                        "INSERT INTO chat_users (email) VALUES (%s) RETURNING id",
                        (email,)
                    )
                    user_id = cur.fetchone()[0]
                    conn.commit()
                else:
                    user_id = user[0]
                
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'userId': user_id, 'email': email})
                }
            
            elif action == 'send':
                # Отправка сообщения
                user_id = body.get('userId')
                message = body.get('message', '').strip()
                image_url = body.get('imageUrl')
                is_admin = body.get('isAdmin', False)
                
                if not user_id or (not message and not image_url):
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'Invalid request'})
                    }
                
                cur.execute(
                    "INSERT INTO chat_messages (user_id, message, image_url, is_admin) VALUES (%s, %s, %s, %s) RETURNING id, created_at",
                    (user_id, message or 'Sent an image', image_url, is_admin)
                )
                msg_id, created_at = cur.fetchone()
                conn.commit()
                
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({
                        'messageId': msg_id,
                        'timestamp': created_at.isoformat()
                    })
                }
        
        elif method == 'GET':
            if action == 'messages':
                # Получить сообщения пользователя
                user_id = query_params.get('userId')
                
                if not user_id:
                    return {
                        'statusCode': 400,
                        'headers': cors_headers,
                        'body': json.dumps({'error': 'User ID required'})
                    }
                
                cur.execute("""
                    SELECT id, message, image_url, is_admin, created_at 
                    FROM chat_messages 
                    WHERE user_id = %s 
                    ORDER BY created_at ASC
                """, (user_id,))
                
                messages = []
                for row in cur.fetchall():
                    messages.append({
                        'id': row[0],
                        'text': row[1],
                        'image': row[2],
                        'sender': 'admin' if row[3] else 'user',
                        'timestamp': row[4].isoformat()
                    })
                
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'messages': messages})
                }
            
            elif action == 'users':
                # Получить всех пользователей (для админа)
                cur.execute("""
                    SELECT 
                        u.id, 
                        u.email, 
                        u.created_at,
                        COUNT(m.id) as message_count,
                        MAX(m.created_at) as last_message
                    FROM chat_users u
                    LEFT JOIN chat_messages m ON u.id = m.user_id AND m.is_admin = false
                    GROUP BY u.id, u.email, u.created_at
                    ORDER BY last_message DESC NULLS LAST
                """)
                
                users = []
                for row in cur.fetchall():
                    users.append({
                        'id': row[0],
                        'email': row[1],
                        'joined': row[2].isoformat(),
                        'messageCount': row[3],
                        'lastMessage': row[4].isoformat() if row[4] else None
                    })
                
                return {
                    'statusCode': 200,
                    'headers': cors_headers,
                    'body': json.dumps({'users': users})
                }
        
        return {
            'statusCode': 400,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Invalid action'})
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': cors_headers,
            'body': json.dumps({'error': str(e)})
        }
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()