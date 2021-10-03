import axios from 'axios';

export type GearData = {
  id: string;
  primary: boolean;
  name: string;
  distance: number;
  retired: boolean;
};

export type AthleteData = {
  id: number;
  bikes: GearData[];
  shoes: GearData[];
};

const getAthlete = async (accessToken: string): Promise<AthleteData> => {
  const res: any = await axios.get(`https://www.strava.com/api/v3/athlete`, {
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return res?.data || undefined;
};

export default getAthlete;
