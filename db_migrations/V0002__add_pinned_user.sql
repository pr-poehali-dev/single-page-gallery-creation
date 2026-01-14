-- Добавляем поле для закрепления пользователя
ALTER TABLE chat_users ADD COLUMN is_pinned BOOLEAN DEFAULT FALSE;

-- Создаём тестового пользователя и закрепляем его
INSERT INTO chat_users (email, is_pinned) 
VALUES ('test@example.com', TRUE)
ON CONFLICT DO NOTHING;