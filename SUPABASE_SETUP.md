# Настройка Supabase для админ-панели

Этот документ описывает, как настроить Supabase для управления контентом медиакита.

## 📋 Необходимые шаги

### 1. Создание проекта в Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте аккаунт или войдите
3. Создайте новый проект:
   - Название: `media-kit-mishka-maks`
   - Database Password: (сохраните надежный пароль)
   - Region: выберите ближайший регион

### 2. Создание таблиц в базе данных

Выполните следующие SQL запросы в SQL Editor Supabase:

```sql
-- Общие настройки сайта
CREATE TABLE site_config (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Статистика каналов
CREATE TABLE metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  icon TEXT NOT NULL,
  followers INTEGER NOT NULL,
  label TEXT NOT NULL,
  detail TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Демография аудитории
CREATE TABLE audience (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL, -- 'age', 'geography', 'interests'
  label TEXT NOT NULL,
  value JSONB, -- flexible data structure
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Форматы размещения
CREATE TABLE formats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  icon TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price INTEGER DEFAULT 1000,
  duration TEXT,
  specifications TEXT,
  reach TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Портфолио (примеры работ)
CREATE TABLE portfolio (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  thumbnail_url TEXT,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Тарифы (на будущее, если понадобятся пакеты)
CREATE TABLE pricing_packages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  features JSONB NOT NULL,
  badge TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Кейсы и достижения
CREATE TABLE cases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stat_value TEXT NOT NULL,
  label TEXT NOT NULL,
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- О создателе
CREATE TABLE about (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  avatar_emoji TEXT DEFAULT '🐻',
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  advantages JSONB, -- [{icon: "✓", text: "..."}, ...]
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- FAQ
CREATE TABLE faq (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Включение Row Level Security (RLS)

```sql
-- Включить RLS для всех таблиц
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audience ENABLE ROW LEVEL SECURITY;
ALTER TABLE formats ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;
ALTER TABLE pricing_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE about ENABLE ROW LEVEL SECURITY;
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

-- Политики для публичного чтения
CREATE POLICY "Enable read access for all users" ON site_config FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON metrics FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON audience FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON formats FOR SELECT USING (is_active = true);
CREATE POLICY "Enable read access for all users" ON portfolio FOR SELECT USING (is_active = true);
CREATE POLICY "Enable read access for all users" ON pricing_packages FOR SELECT USING (is_active = true);
CREATE POLICY "Enable read access for all users" ON cases FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON about FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON faq FOR SELECT USING (is_active = true);

-- Политики для админа (требуется аутентификация)
CREATE POLICY "Enable all for authenticated users" ON site_config FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON metrics FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON audience FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON formats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON portfolio FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON pricing_packages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON cases FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON about FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Enable all for authenticated users" ON faq FOR ALL USING (auth.role() = 'authenticated');
```

### 4. Заполнение начальными данными

```sql
-- Site Config
INSERT INTO site_config (key, value) VALUES
  ('site_title', 'Реклама на детских каналах'),
  ('telegram_url', 'https://t.me/yourusername'),
  ('email', 'your@email.com'),
  ('instagram_url', 'https://instagram.com/mishka.maks'),
  ('tiktok_url', 'https://tiktok.com/@mishka.maks');

-- Metrics
INSERT INTO metrics (platform, icon, followers, label, detail, sort_order) VALUES
  ('instagram', '📸', 119000, 'Instagram', '@mishka.maks', 1),
  ('tiktok', '🎵', 67000, 'TikTok', '@mishka.maks', 2),
  ('telegram', '✈️', 4000, 'Telegram', 'Канал', 3),
  ('engagement', '❤️', NULL, 'Вовлечённость', 'Выше среднего', 4);

-- Formats
INSERT INTO formats (icon, title, description, price, duration, specifications, reach, sort_order) VALUES
  ('📷', 'Пост в ленте Instagram', 'Классическое размещение с максимальным охватом', 1000, '24-48 часов', '1080x1080px, 1-5 слайдов', '50K-80K', 1),
  ('📲', 'Stories Instagram', 'Динамичный контент с высокой вовлечённостью', 1000, '24 часа', '1080x1920px, 3-5 слайдов', '30K-50K', 2),
  ('🎥', 'Рилс / Shorts', 'Короткий вирусный контент', 1000, '15-60 секунд', 'Вертикальный формат 9:16', '40K-100K', 3),
  ('🎬', 'Интеграция в контент', 'Органичное упоминание в контексте видео', 1000, '2-3 минуты видео', 'Нативная реклама', '80K-120K', 4);

-- About
INSERT INTO about (name, title, bio, avatar_emoji, advantages) VALUES
  ('Мишка Макс', 'Детский контент-канал', 'Создаем качественный и познавательный контент для детей и их родителей.', '🐻',
  '[{"icon": "✓", "text": "5 лет опыта работы с детской аудиторией"}, {"icon": "✓", "text": "Высокое качество контента и вовлечённость"}, {"icon": "✓", "text": "Прозрачная статистика и отчётность"}]'::jsonb);

-- Cases
INSERT INTO cases (stat_value, label, description, sort_order) VALUES
  ('8-12%', 'Вовлечённость', 'Средний ER значительно выше рынка', 1),
  ('94%', 'Родители', 'Платежеспособная аудитория', 2),
  ('100%', 'Органический рост', 'Без накруток и ботов', 3);

-- FAQ
INSERT INTO faq (question, answer, sort_order) VALUES
  ('Как быстро выйдет реклама?', 'Обычно размещение происходит в течение 3-5 рабочих дней после согласования контента.', 1),
  ('Можно ли посмотреть статистику?', 'Да, мы предоставляем детальную статистику по охватам, вовлечённости и демографии после размещения.', 2),
  ('Какие требования к рекламному контенту?', 'Контент должен соответствовать детской аудитории, быть качественным и не противоречить законодательству.', 3),
  ('Есть ли скидки?', 'Да! При заказе 3 форматов - 10%, 4 форматов - 15%, 5+ форматов - 20% скидки.', 4),
  ('Как происходит оплата?', 'Оплата производится после согласования всех деталей. Мы работаем как по предоплате, так и по постоплате для постоянных клиентов.', 5),
  ('Можно ли заказать индивидуальный проект?', 'Конечно! Свяжитесь с нами для обсуждения особых условий и кастомных решений для вашего бренда.', 6);
```

### 5. Создание админского пользователя

1. В Supabase перейдите в **Authentication** > **Users**
2. Создайте нового пользователя с email и паролем
3. Этот пользователь сможет редактировать контент через админ-панель

### 6. Получение API ключей

1. Перейдите в **Settings** > **API**
2. Скопируйте:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon/public** ключ

### 7. Добавление переменных окружения

Для Vercel:
1. Перейдите в настройки проекта на Vercel
2. Добавьте Environment Variables:
   - `SUPABASE_URL`: ваш Project URL
   - `SUPABASE_ANON_KEY`: ваш anon key

Для локальной разработки создайте `.env.local`:
```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=ваш_anon_key
```

## 🔐 Безопасность

- ✅ Row Level Security (RLS) включен на всех таблицах
- ✅ Публичный доступ только на чтение
- ✅ Изменения доступны только авторизованным пользователям
- ✅ API ключи хранятся в переменных окружения

## 📚 Дополнительные ресурсы

- [Документация Supabase](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

После настройки Supabase вы сможете управлять всем контентом сайта через админ-панель, не редактируя код напрямую!
