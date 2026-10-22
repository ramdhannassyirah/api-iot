import * as authService from './auth.service.js';

export const register = async (req, res) => {
  res.status(201).json(await authService.register(req.body));
};

export const login = async (req, res) => {
  res.json(await authService.login(req.body));
};

export const google = async (req, res) => {
  res.json(await authService.loginWithGoogle(req.body.idToken));
};

export const refresh = async (req, res) => {
  res.json(await authService.refresh(req.body.refreshToken));
};

export const logout = async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(204).end();
};

export const me = async (req, res) => {
  res.json({ user: await authService.getProfile(req.user.id) });
};
