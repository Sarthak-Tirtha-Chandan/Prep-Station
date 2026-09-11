/**
 * Date formatting utilities for tasks and checklists.
 */

const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Extracts a valid creation Date object from a todo document
 * using createdAt, MongoDB ObjectId timestamp, or timestamped ID.
 */
export function getTodoCreationDate(todo) {
  if (!todo) return null;

  if (todo.createdAt) {
    const d = new Date(todo.createdAt);
    if (!isNaN(d.getTime())) return d;
  }

  // Extract from 24-character MongoDB ObjectId
  if (todo._id && typeof todo._id === 'string' && /^[0-9a-fA-F]{24}$/.test(todo._id)) {
    const sec = parseInt(todo._id.substring(0, 8), 16);
    if (!isNaN(sec) && sec > 1500000000) {
      return new Date(sec * 1000);
    }
  }

  // Extract from client-generated timestamp id (e.g. todo-1725999999999)
  if (todo.id && typeof todo.id === 'string' && todo.id.startsWith('todo-')) {
    const ms = Number(todo.id.replace('todo-', ''));
    if (!isNaN(ms) && ms > 1500000000000) {
      return new Date(ms);
    }
  }

  return null;
}

/**
 * Dynamically formats the todo due date.
 * If a task was due 'Today' (or set for today) and the calendar day has passed,
 * it dynamically displays 'Yesterday' without modifying MongoDB data.
 */
export function formatTodoDueDate(todo) {
  if (!todo) return '';

  const rawDue = (todo.dueDate || '').trim();
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

  // 1. If dueDate is a parseable date string (e.g., '2026-09-10' or ISO date)
  const parsedDue = new Date(rawDue);
  if (rawDue && !isNaN(parsedDue.getTime()) && !/^(today|tomorrow|yesterday)$/i.test(rawDue)) {
    const dueMidnight = new Date(parsedDue.getFullYear(), parsedDue.getMonth(), parsedDue.getDate()).getTime();
    const diff = Math.round((todayMidnight - dueMidnight) / ONE_DAY_MS);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff === -1) return 'Tomorrow';
    if (diff > 1) return 'Yesterday';
    return rawDue;
  }

  // 2. Evaluate relative to the creation date
  const createdDate = getTodoCreationDate(todo);
  if (createdDate) {
    const createdMidnight = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate()).getTime();
    const daysSinceCreation = Math.round((todayMidnight - createdMidnight) / ONE_DAY_MS);

    if (daysSinceCreation >= 1) {
      // The day of creation has passed
      if (!rawDue || /^today$/i.test(rawDue)) {
        return 'Yesterday';
      }
      if (/^tomorrow$/i.test(rawDue)) {
        if (daysSinceCreation === 1) return 'Today';
        return 'Yesterday';
      }
      if (/^yesterday$/i.test(rawDue)) {
        return 'Yesterday';
      }
    } else {
      // Created today
      if (!rawDue || /^today$/i.test(rawDue)) {
        return 'Today';
      }
      if (/^tomorrow$/i.test(rawDue)) {
        return 'Tomorrow';
      }
    }
  }

  // Fallback to the saved string or 'Today'
  return rawDue || 'Today';
}
