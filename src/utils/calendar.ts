import { TechEvent } from '../types';
import { format } from 'date-fns';

// 格式化日期为 iCalendar 格式
const formatICalDate = (date: Date): string => {
  return format(date, "yyyyMMdd'T'HHmmss'Z'");
};

// 生成 .ics 文件内容
export const generateICS = (event: TechEvent): string => {
  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  
  const locationStr = event.location 
    ? `${event.location.city}, ${event.location.country}`
    : event.format === 'online' ? 'Online Event' : '';
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GlobalTechEvents//Event Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${formatICalDate(startDate)}`,
    `DTEND:${formatICalDate(endDate)}`,
    `DTSTAMP:${formatICalDate(new Date())}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.summary}\\n\\nOrganizer: ${event.organizer.name}\\n\\nMore info: ${event.links.officialSite}`,
    `LOCATION:${locationStr}`,
    `URL:${event.links.officialSite}`,
    `STATUS:CONFIRMED`,
    `SEQUENCE:0`,
    `UID:${event.id}@globaltechevents.com`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
  
  return icsContent;
};

// 下载 .ics 文件
export const downloadICS = (event: TechEvent): void => {
  const icsContent = generateICS(event);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${event.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

// 生成 Google Calendar 链接
export const getGoogleCalendarUrl = (event: TechEvent): string => {
  const startDate = format(new Date(event.startTime), "yyyyMMdd'T'HHmmss'Z'");
  const endDate = format(new Date(event.endTime), "yyyyMMdd'T'HHmmss'Z'");
  
  const locationStr = event.location 
    ? `${event.location.city}, ${event.location.country}`
    : event.format === 'online' ? 'Online Event' : '';
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDate}/${endDate}`,
    details: `${event.summary}\n\nOrganizer: ${event.organizer.name}\n\nMore info: ${event.links.officialSite}`,
    location: locationStr,
    sprop: 'website:globaltechevents.com'
  });
  
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// 生成 Outlook 链接
export const getOutlookUrl = (event: TechEvent): string => {
  const startDate = new Date(event.startTime).toISOString();
  const endDate = new Date(event.endTime).toISOString();
  
  const locationStr = event.location 
    ? `${event.location.city}, ${event.location.country}`
    : event.format === 'online' ? 'Online Event' : '';
  
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    startdt: startDate,
    enddt: endDate,
    body: `${event.summary}\n\nOrganizer: ${event.organizer.name}\n\nMore info: ${event.links.officialSite}`,
    location: locationStr
  });
  
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
};

// 生成 Apple Calendar 链接（使用 .ics 下载）
export const addToAppleCalendar = (event: TechEvent): void => {
  downloadICS(event);
};
