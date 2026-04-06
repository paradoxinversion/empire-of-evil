import type { GoverningOrganization } from '../../types/index.js';
import { createGoverningOrganization } from '../../factories/index.js';

export interface GoverningOrgsResult {
  organizations: Record<string, GoverningOrganization>;
  /** nationId → org ID */
  nationOrgMap: Map<string, string>;
  empireOrgId: string;
}

/**
 * Phase 6: Create governing organizations — one per nation, one for the empire.
 * All start with intelLevel: 0.
 */
export function generateGoverningOrgs(
  nationZones: Map<string, string[]>,
  _empireOriginZoneId: string,
): GoverningOrgsResult {
  const organizations: Record<string, GoverningOrganization> = {};
  const nationOrgMap = new Map<string, string>();

  for (const [nationId] of nationZones) {
    const org = createGoverningOrganization({ name: `Government of ${nationId}` });
    organizations[org.id] = org;
    nationOrgMap.set(nationId, org.id);
  }

  const empireOrg = createGoverningOrganization({ name: 'Empire' });
  organizations[empireOrg.id] = empireOrg;

  return { organizations, nationOrgMap, empireOrgId: empireOrg.id };
}
