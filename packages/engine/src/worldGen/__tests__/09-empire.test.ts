import { describe, test, expect } from 'vitest';
import { initializeEmpire } from '../phases/09-empire.js';
import type { PetDefinition } from '../../config/loader.js';

const pets: PetDefinition[] = [
  { id: 'cat', name: 'Cat', description: 'A cat.' },
  { id: 'tiger', name: 'Tiger', description: 'A tiger.' },
];

const defaultResources = { money: 500, science: 0, infrastructure: 100 };

describe('initializeEmpire', () => {
  test('overlord person exists in persons result', () => {
    const result = initializeEmpire('empire-zone', 'empire-org', pets, {}, defaultResources, 42);
    expect(result.persons[result.overlordId]).toBeDefined();
  });

  test('overlord has agentStatus with job unassigned', () => {
    const result = initializeEmpire('empire-zone', 'empire-org', pets, {}, defaultResources, 1);
    const overlord = result.persons[result.overlordId]!;
    expect(overlord.agentStatus).toBeDefined();
    expect(overlord.agentStatus!.job).toBe('unassigned');
  });

  test('pet person exists in persons result', () => {
    const result = initializeEmpire('empire-zone', 'empire-org', pets, {}, defaultResources, 5);
    expect(result.persons[result.petId]).toBeDefined();
  });

  test('pet matches petTypeId when provided', () => {
    const result = initializeEmpire('empire-zone', 'empire-org', pets, { petTypeId: 'tiger' }, defaultResources, 3);
    const pet = result.persons[result.petId]!;
    expect(pet.name).toBe('Tiger');
  });

  test('pet is randomly chosen when petTypeId is not provided', () => {
    const result = initializeEmpire('empire-zone', 'empire-org', pets, {}, defaultResources, 7);
    const pet = result.persons[result.petId]!;
    expect(['Cat', 'Tiger']).toContain(pet.name);
  });

  test('headquarters building is placed in the empire zone', () => {
    const result = initializeEmpire('empire-zone', 'empire-org', pets, {}, defaultResources, 2);
    expect(result.hqBuildingId).toBeDefined();
    const hq = result.buildings[result.hqBuildingId!];
    expect(hq).toBeDefined();
    expect(hq!.typeId).toBe('headquarters');
    expect(hq!.zoneId).toBe('empire-zone');
  });

  test('starting resources come from params when provided', () => {
    const customResources = { money: 1000, science: 50, infrastructure: 200 };
    const result = initializeEmpire('empire-zone', 'empire-org', pets, { startingResources: customResources }, defaultResources, 1);
    expect(result.resources).toEqual(customResources);
  });

  test('starting resources fall back to defaults when not provided', () => {
    const result = initializeEmpire('empire-zone', 'empire-org', pets, {}, defaultResources, 1);
    expect(result.resources).toEqual(defaultResources);
  });

  test('overlord and pet are placed in the empire zone', () => {
    const result = initializeEmpire('empire-zone', 'empire-org', pets, {}, defaultResources, 1);
    expect(result.persons[result.overlordId]!.zoneId).toBe('empire-zone');
    expect(result.persons[result.petId]!.zoneId).toBe('empire-zone');
  });
});
