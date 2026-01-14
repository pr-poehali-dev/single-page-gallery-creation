-- Добавляем сообщение от админа закреплённому пользователю
INSERT INTO chat_messages (user_id, message, is_admin) 
VALUES (1, 'Admin sent. Check photo to pay.', TRUE);