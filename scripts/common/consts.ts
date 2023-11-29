// Define mapping for each variable to its associated environment
export const CLIENT_ENV_LOCALS = [
  'DOMAIN_NAME',
  'PROJECT_NAME',
  'AWS_REGION',
  'READY_PLAYER_ME_SUBDOMAIN',
];

export const SERVER_ENV_LOCALS = ['DOMAIN_NAME', 'PROJECT_NAME', 'AWS_REGION'];

export const PROMPTS = [
  'DOMAIN_NAME',
  'READY_PLAYER_ME_SUBDOMAIN',
  'PROJECT_NAME',
  'AWS_REGION',
];

export enum CLI_ARG {
  DOMAIN_NAME = 2,
  READY_PLAYER_ME_SUBDOMAIN = 3,
  PROJECT_NAME = 4,
  AWS_REGION = 5,
}

export const SCRIPTS_DIR = './scripts';
export const AWS_SCRIPTS = `${SCRIPTS_DIR}/aws`;
export const ENV_SCRIPTS = `${SCRIPTS_DIR}/env`;
export const INIT_SCRIPTS = `${SCRIPTS_DIR}/init`;
export const PULUMI_SCRIPTS = `${SCRIPTS_DIR}/pulumi`;

export const CLIENT_DIR = 'src/client';
export const SERVER_DIR = 'src/server';

export enum InfrastructureType {
  SHARED = 'shared',
  CLIENT = 'client',
  SERVER = 'server',
}
