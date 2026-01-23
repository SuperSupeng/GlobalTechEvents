import { createClient } from '@supabase/supabase-js';
import { mockEvents } from '../src/data/mockEvents';

// 从环境变量读取配置
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please make sure .env.local file exists with:');
  console.error('  VITE_SUPABASE_URL=your_url');
  console.error('  VITE_SUPABASE_ANON_KEY=your_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateData() {
  console.log('🚀 Starting data migration...\n');

  // 转换数据格式
  const transformedEvents = mockEvents.map(event => ({
    title: event.title,
    summary: event.summary,
    start_time: event.startTime,
    end_time: event.endTime,
    timezone: event.timezone,
    is_all_day: event.isAllDay || false,
    format: event.format,
    location: event.location || null,
    organizer: event.organizer,
    links: event.links,
    tags: event.tags,
    language: event.language,
    price: event.price,
    status: event.status,
  }));

  console.log(`📦 Preparing to migrate ${transformedEvents.length} events...\n`);

  // 插入数据
  const { data, error } = await supabase
    .from('events')
    .insert(transformedEvents)
    .select();

  if (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('Details:', error);
    process.exit(1);
  }

  console.log(`✅ Successfully migrated ${data?.length || 0} events!\n`);
  
  // 显示插入的事件
  if (data && data.length > 0) {
    console.log('Sample events:');
    data.slice(0, 3).forEach((event: any, index) => {
      console.log(`  ${index + 1}. ${event.title}`);
      console.log(`     Date: ${new Date(event.start_time).toLocaleDateString()}`);
      console.log(`     Format: ${event.format}`);
      console.log('');
    });
  }

  console.log('🎉 Migration completed successfully!');
}

// 运行迁移
migrateData().catch(error => {
  console.error('❌ Unexpected error:', error);
  process.exit(1);
});
