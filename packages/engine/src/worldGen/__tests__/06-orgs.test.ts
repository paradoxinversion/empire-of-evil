import { describe, test, expect } from 'vitest';
import { generateGoverningOrgs } from '../phases/06-orgs.js';

describe('generateGoverningOrgs', () => {
  const nationZones = new Map([
    ['nation-1', ['z1', 'z2', 'z3']],
    ['nation-2', ['z4', 'z5', 'z6']],
  ]);
  const empireOriginZoneId = 'z7';

  test('creates one GoverningOrganization per nation plus one empire org', () => {
    const result = generateGoverningOrgs(nationZones, empireOriginZoneId);
    // 2 nations + 1 empire = 3 orgs
    expect(Object.keys(result.organizations)).toHaveLength(3);
  });

  test('all organizations start with intelLevel 0', () => {
    const result = generateGoverningOrgs(nationZones, empireOriginZoneId);
    for (const org of Object.values(result.organizations)) {
      expect(org.intelLevel).toBe(0);
    }
  });

  test('all organization IDs match the correct format', () => {
    const result = generateGoverningOrgs(nationZones, empireOriginZoneId);
    for (const id of Object.keys(result.organizations)) {
      expect(id).toMatch(/^go-\d+$/);
    }
  });

  test('nationOrgMap maps each nation to a valid org ID', () => {
    const result = generateGoverningOrgs(nationZones, empireOriginZoneId);
    for (const [nationId, orgId] of result.nationOrgMap) {
      expect(nationZones.has(nationId)).toBe(true);
      expect(result.organizations[orgId]).toBeDefined();
    }
    expect(result.nationOrgMap.size).toBe(2);
  });

  test('empire org ID is returned separately', () => {
    const result = generateGoverningOrgs(nationZones, empireOriginZoneId);
    expect(result.empireOrgId).toMatch(/^go-\d+$/);
    expect(result.organizations[result.empireOrgId]).toBeDefined();
  });

  test('returns empty organizations and no nation map for empty nations', () => {
    const result = generateGoverningOrgs(new Map(), 'empire-zone');
    // Only the empire org
    expect(Object.keys(result.organizations)).toHaveLength(1);
    expect(result.nationOrgMap.size).toBe(0);
  });
});
