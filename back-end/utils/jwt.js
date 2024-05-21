import jwt from 'jsonwebtoken';

function generateAccessToken(user) {
  return jwt.sign({
      userId: user.id,  
      email: user.email  
  },
  process.env.TOKEN_SECRET,
  { expiresIn: '3h' });
}


export { generateAccessToken };

