export const ROUTES = {
  HOME: '/',
  AUTH: 'auth',
  WORKOUTS: 'workouts',
  EXERCISES: 'exercises',
  PROFILE: 'profile',

  get NEW_WORKOUT() {
    return `${this.WORKOUTS}/new`;
  },
} as const;
