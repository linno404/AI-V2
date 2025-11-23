const { PrismaClient } = '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient({
  datasources: {
    db: {
      provider: 'sqlite',
      url: process.env.DATABASE_URL || 'file:./dev.db'
    }
  }
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function isAdmin(decoded) {
  return decoded && decoded.role === 'ADMIN';
}

export const handler = async (event, context) => {
  const { httpMethod, path } = event;
  const { body, headers } = event;
  
  // Enable CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
    };
  }

  try {
    if (path === '/api/auth/login' && httpMethod === 'POST') {
      const { username, password } = JSON.parse(body);
      
      const user = await prisma.user.findFirst({
        where: {
          OR: [
            { username },
            { email: username }
          ]
        }
      });

      if (!user || !await bcrypt.compare(password, user.password)) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: { error: 'Invalid credentials' }
        };
      }

      const token = jwt.sign(
        { 
          userId: user.id, 
          username: user.username, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: {
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      };
    }

    if (path === '/api/auth/register' && httpMethod === 'POST') {
      const { username, email, password } = JSON.parse(body);
      
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email },
            { username }
          ]
        }
      });

      if (existingUser) {
        return {
          statusCode: 400,
          headers: corsHeaders,
          body: { error: 'User with this email or username already exists' }
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: 'USER'
        }
      });

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: {
          message: 'User created successfully',
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
          }
        }
      };
    }

    if (path === '/api/chat/history' && httpMethod === 'GET') {
      const authHeader = headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: { error: 'Authorization token required' }
        };
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (!decoded) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: { error: 'Invalid token' }
        };
      }

      const chats = await prisma.chat.findMany({
        where: {
          userId: decoded.userId
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: chats
      };
    }

    if (path === '/api/chat' && httpMethod === 'POST') {
      const authHeader = headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: { error: 'Authorization token required' }
        };
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (!decoded) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: { error: 'Invalid token' }
        };
      }

      const { message } = JSON.parse(body);

      // Simulate AI response (you can integrate with real AI API here)
      const aiResponse = `This is a simulated response to: "${message}". In production, this would connect to Cerebras API.`;

      // Save chat to database
      await prisma.chat.create({
        data: {
          userId: decoded.userId,
          message,
          response: aiResponse
        }
      });

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: { response: aiResponse }
      };
    }

    // Admin routes
    if (path === '/api/admin/users' && httpMethod === 'GET') {
      const authHeader = headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: { error: 'Authorization token required' }
        };
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (!decoded || !isAdmin(decoded)) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: { error: 'Admin access required' }
        };
      }

      const users = await prisma.user.findMany({
        include: {
          _count: {
            select: {
              chats: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: users
      };
    }

    if (path === '/api/admin/chats' && httpMethod === 'GET') {
      const authHeader = headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return {
          statusCode: 401,
          headers: corsHeaders,
          body: { error: 'Authorization token required' }
        };
      }

      const token = authHeader.substring(7);
      const decoded = verifyToken(token);

      if (!decoded || !isAdmin(decoded)) {
        return {
          statusCode: 403,
          headers: corsHeaders,
          body: { error: 'Admin access required' }
        };
      }

      const chats = await prisma.chat.findMany({
        include: {
          user: {
            select: {
              username: true
            }
          }
        },
        orderBy: {
          timestamp: 'desc'
        }
      });

      return {
        statusCode: 200,
        headers: corsHeaders,
        body: chats
      };
    }

    return {
      statusCode: 404,
      headers: corsHeaders,
      body: { error: 'Not found' }
    };

  } catch (error) {
    console.error('Function error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: { error: 'Internal server error' }
    };
  }
};