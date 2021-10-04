import { GearData } from '@/services/strava/getAthlete';
import { GearRecord } from '@/models/Gear';

export const generateGearFromAthlete = (
  accountId: string,
  gearType: string,
  athleteGears: GearData[]
) => {
  return athleteGears
    .filter((bike) => !bike.retired)
    .map((bike) => ({
      id: bike.id,
      accountId,
      primary: bike.primary,
      name: bike.name,
      retired: bike.retired,
      distance: bike.distance,
      gearType,
    }));
};

const maintenanceItems = [
  {
    property: 'lastChainAt',
    label: 'Chain',
    lifeDistance: 5000000,
  },
  {
    property: 'lastTiresAt',
    label: 'Tires',
    lifeDistance: 5000000,
  },
  {
    property: 'lastBrakePadsAt',
    label: 'Brake Pads',
    lifeDistance: 15000000,
  },
  {
    property: 'lastCablesAt',
    label: 'Cables/Fluids',
    lifeDistance: 10000000,
  },
];

export const populateMaintenanceItems = (gear: GearRecord) => {
  return maintenanceItems.map((i) => {
    let lastMaintenanceAt = gear[i.property as keyof GearRecord];
    if (typeof lastMaintenanceAt !== 'number') {
      lastMaintenanceAt = 0;
    }
    return {
      gearId: gear.id,
      accountId: gear.accountId,
      property: i.property,
      label: i.label,
      dueDistance: i.lifeDistance - (gear.distance - lastMaintenanceAt),
      lastMaintenanceAt,
    };
  });
};
