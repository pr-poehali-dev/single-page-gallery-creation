-- Обновляем email закреплённого пользователя
UPDATE chat_users 
SET email = 'admin@support.com' 
WHERE id = 1 AND is_pinned = TRUE;