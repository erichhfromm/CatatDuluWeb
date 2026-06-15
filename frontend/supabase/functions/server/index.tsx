import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Health check endpoint
app.get("/make-server-53620e8e/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up route
app.post('/make-server-53620e8e/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true
    });

    if (error) {
      console.log(`Sign up error: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    await kv.set(`user:${data.user.id}`, {
      id: data.user.id,
      email: data.user.email,
      name,
      created_at: new Date().toISOString(),
      balance: 0,
      notifications_enabled: true
    });

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Sign up server error: ${error}`);
    return c.json({ error: 'Internal server error during sign up' }, 500);
  }
});

// Get user profile
app.get('/make-server-53620e8e/auth/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const profile = await kv.get(`user:${user.id}`);
    return c.json({ profile: profile || { id: user.id, email: user.email } });
  } catch (error) {
    console.log(`Get profile error: ${error}`);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update user profile
app.put('/make-server-53620e8e/auth/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();
    const currentProfile = await kv.get(`user:${user.id}`) || {};

    const updatedProfile = {
      ...currentProfile,
      ...updates,
      id: user.id,
      updated_at: new Date().toISOString()
    };

    await kv.set(`user:${user.id}`, updatedProfile);
    return c.json({ profile: updatedProfile });
  } catch (error) {
    console.log(`Update profile error: ${error}`);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Get transactions
app.get('/make-server-53620e8e/transactions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const transactions = await kv.getByPrefix(`transaction:${user.id}:`);
    return c.json({ transactions: transactions.sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ) });
  } catch (error) {
    console.log(`Get transactions error: ${error}`);
    return c.json({ error: 'Failed to fetch transactions' }, 500);
  }
});

// Add transaction
app.post('/make-server-53620e8e/transactions', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { type, amount, category, description, qr_data } = await c.req.json();
    const transactionId = crypto.randomUUID();

    const transaction = {
      id: transactionId,
      user_id: user.id,
      type,
      amount,
      category,
      description,
      qr_data,
      created_at: new Date().toISOString()
    };

    await kv.set(`transaction:${user.id}:${transactionId}`, transaction);

    const profile = await kv.get(`user:${user.id}`) || { balance: 0 };
    const newBalance = type === 'income'
      ? profile.balance + amount
      : profile.balance - amount;

    await kv.set(`user:${user.id}`, {
      ...profile,
      balance: newBalance,
      updated_at: new Date().toISOString()
    });

    return c.json({ transaction, balance: newBalance });
  } catch (error) {
    console.log(`Add transaction error: ${error}`);
    return c.json({ error: 'Failed to add transaction' }, 500);
  }
});

// Get notifications
app.get('/make-server-53620e8e/notifications', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notifications = await kv.getByPrefix(`notification:${user.id}:`);
    return c.json({ notifications: notifications.sort((a: any, b: any) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    ) });
  } catch (error) {
    console.log(`Get notifications error: ${error}`);
    return c.json({ error: 'Failed to fetch notifications' }, 500);
  }
});

// Mark notification as read
app.put('/make-server-53620e8e/notifications/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const notificationId = c.req.param('id');
    const notification = await kv.get(`notification:${user.id}:${notificationId}`);

    if (!notification) {
      return c.json({ error: 'Notification not found' }, 404);
    }

    const updated = { ...notification, read: true };
    await kv.set(`notification:${user.id}:${notificationId}`, updated);
    return c.json({ notification: updated });
  } catch (error) {
    console.log(`Mark notification as read error: ${error}`);
    return c.json({ error: 'Failed to update notification' }, 500);
  }
});

// Get financial summary
app.get('/make-server-53620e8e/summary', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const transactions = await kv.getByPrefix(`transaction:${user.id}:`);
    const profile = await kv.get(`user:${user.id}`) || { balance: 0 };

    const totalIncome = transactions
      .filter((t: any) => t.type === 'income')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t: any) => t.type === 'expense')
      .reduce((sum: number, t: any) => sum + t.amount, 0);

    const categoryBreakdown = transactions.reduce((acc: any, t: any) => {
      if (t.type === 'expense') {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
      }
      return acc;
    }, {});

    return c.json({
      balance: profile.balance,
      totalIncome,
      totalExpense,
      categoryBreakdown,
      transactionCount: transactions.length
    });
  } catch (error) {
    console.log(`Get summary error: ${error}`);
    return c.json({ error: 'Failed to fetch summary' }, 500);
  }
});

// Get budgets
app.get('/make-server-53620e8e/budgets', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const budgets = await kv.getByPrefix(`budget:${user.id}:`);
    return c.json({ budgets: budgets || [] });
  } catch (error) {
    console.log(`Get budgets error: ${error}`);
    return c.json({ error: 'Failed to fetch budgets' }, 500);
  }
});

// Create budget
app.post('/make-server-53620e8e/budgets', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { category, amount, period, startDate, notifications } = await c.req.json();
    const budgetId = crypto.randomUUID();

    const budget = {
      id: budgetId,
      user_id: user.id,
      category,
      amount,
      spent: 0,
      period,
      startDate,
      notifications,
      created_at: new Date().toISOString()
    };

    await kv.set(`budget:${user.id}:${budgetId}`, budget);
    return c.json({ budget });
  } catch (error) {
    console.log(`Create budget error: ${error}`);
    return c.json({ error: 'Failed to create budget' }, 500);
  }
});

// Get budget detail
app.get('/make-server-53620e8e/budgets/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const budgetId = c.req.param('id');
    const budget = await kv.get(`budget:${user.id}:${budgetId}`);

    if (!budget) {
      return c.json({ error: 'Budget not found' }, 404);
    }

    const transactions = await kv.getByPrefix(`transaction:${user.id}:`);
    const relatedTransactions = transactions.filter(
      (t: any) => t.type === 'expense' && t.category === budget.category
    );

    return c.json({ budget, transactions: relatedTransactions });
  } catch (error) {
    console.log(`Get budget detail error: ${error}`);
    return c.json({ error: 'Failed to fetch budget' }, 500);
  }
});

// Delete budget
app.delete('/make-server-53620e8e/budgets/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const budgetId = c.req.param('id');
    await kv.del(`budget:${user.id}:${budgetId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete budget error: ${error}`);
    return c.json({ error: 'Failed to delete budget' }, 500);
  }
});

// Get savings goals
app.get('/make-server-53620e8e/savings-goals', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const goals = await kv.getByPrefix(`savings:${user.id}:`);
    return c.json({ goals: goals || [] });
  } catch (error) {
    console.log(`Get savings goals error: ${error}`);
    return c.json({ error: 'Failed to fetch goals' }, 500);
  }
});

// Create savings goal
app.post('/make-server-53620e8e/savings-goals', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, target, current, category, deadline, icon } = await c.req.json();
    const goalId = crypto.randomUUID();

    const goal = {
      id: goalId,
      user_id: user.id,
      name,
      target,
      current: current || 0,
      category,
      deadline,
      icon,
      created_at: new Date().toISOString()
    };

    await kv.set(`savings:${user.id}:${goalId}`, goal);
    return c.json({ goal });
  } catch (error) {
    console.log(`Create savings goal error: ${error}`);
    return c.json({ error: 'Failed to create goal' }, 500);
  }
});

// Get categories
app.get('/make-server-53620e8e/categories', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const categories = await kv.getByPrefix(`category:${user.id}:`);
    return c.json({ categories: categories || [] });
  } catch (error) {
    console.log(`Get categories error: ${error}`);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

// Create category
app.post('/make-server-53620e8e/categories', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, icon, color, type } = await c.req.json();
    const categoryId = crypto.randomUUID();

    const category = {
      id: categoryId,
      user_id: user.id,
      name,
      icon,
      color,
      type,
      created_at: new Date().toISOString()
    };

    await kv.set(`category:${user.id}:${categoryId}`, category);
    return c.json({ category });
  } catch (error) {
    console.log(`Create category error: ${error}`);
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

// Get transaction detail
app.get('/make-server-53620e8e/transactions/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const transactionId = c.req.param('id');
    const transaction = await kv.get(`transaction:${user.id}:${transactionId}`);

    if (!transaction) {
      return c.json({ error: 'Transaction not found' }, 404);
    }

    return c.json({ transaction });
  } catch (error) {
    console.log(`Get transaction detail error: ${error}`);
    return c.json({ error: 'Failed to fetch transaction' }, 500);
  }
});

// Update transaction
app.put('/make-server-53620e8e/transactions/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const transactionId = c.req.param('id');
    const transaction = await kv.get(`transaction:${user.id}:${transactionId}`);

    if (!transaction) {
      return c.json({ error: 'Transaction not found' }, 404);
    }

    const updates = await c.req.json();
    const updatedTransaction = {
      ...transaction,
      ...updates,
      updated_at: new Date().toISOString()
    };

    await kv.set(`transaction:${user.id}:${transactionId}`, updatedTransaction);
    return c.json({ transaction: updatedTransaction });
  } catch (error) {
    console.log(`Update transaction error: ${error}`);
    return c.json({ error: 'Failed to update transaction' }, 500);
  }
});

// Delete transaction
app.delete('/make-server-53620e8e/transactions/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user || error) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const transactionId = c.req.param('id');
    await kv.del(`transaction:${user.id}:${transactionId}`);
    return c.json({ success: true });
  } catch (error) {
    console.log(`Delete transaction error: ${error}`);
    return c.json({ error: 'Failed to delete transaction' }, 500);
  }
});

Deno.serve(app.fetch);