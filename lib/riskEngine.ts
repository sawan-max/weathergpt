import { RiskAssessment, RiskContributor, SelectedLocation } from './types';
import { getWeather } from './weather';
import { generateAlerts } from './weather';

interface TerrainInfo { elevation: number; slope: number; terrainType: 'plains' | 'hills' | 'mountains' | 'coastal' | 'plateau'; historicalHazard: number; }

const TERRAIN_DB: Record<string, TerrainInfo> = {
  gangtok: { elevation: 1650, slope: 35, terrainType: 'mountains', historicalHazard: 75 },
  shimla: { elevation: 2276, slope: 25, terrainType: 'mountains', historicalHazard: 55 },
  manali: { elevation: 2050, slope: 30, terrainType: 'mountains', historicalHazard: 65 },
  nainital: { elevation: 2084, slope: 28, terrainType: 'mountains', historicalHazard: 60 },
  dehradun: { elevation: 640, slope: 15, terrainType: 'hills', historicalHazard: 45 },
  musssoorie: { elevation: 1879, slope: 30, terrainType: 'mountains', historicalHazard: 58 },
  darjeeling: { elevation: 2042, slope: 32, terrainType: 'mountains', historicalHazard: 62 },
  leh: { elevation: 3500, slope: 20, terrainType: 'mountains', historicalHazard: 40 },
  srinagar: { elevation: 1585, slope: 15, terrainType: 'hills', historicalHazard: 50 },
  guwahati: { elevation: 55, slope: 5, terrainType: 'plains', historicalHazard: 55 },
  shillong: { elevation: 1496, slope: 22, terrainType: 'hills', historicalHazard: 60 },
  itanagar: { elevation: 440, slope: 18, terrainType: 'hills', historicalHazard: 52 },
  tawang: { elevation: 3048, slope: 38, terrainType: 'mountains', historicalHazard: 70 },
  cherrapunji: { elevation: 1484, slope: 25, terrainType: 'mountains', historicalHazard: 80 },
  munnar: { elevation: 1600, slope: 22, terrainType: 'hills', historicalHazard: 50 },
  ooty: { elevation: 2240, slope: 20, terrainType: 'mountains', historicalHazard: 45 },
  kullu: { elevation: 1230, slope: 28, terrainType: 'mountains', historicalHazard: 60 },
  dharamshala: { elevation: 1457, slope: 26, terrainType: 'mountains', historicalHazard: 55 },
  rishikesh: { elevation: 372, slope: 10, terrainType: 'hills', historicalHazard: 40 },
  haridwar: { elevation: 314, slope: 5, terrainType: 'plains', historicalHazard: 35 },
  siliguri: { elevation: 122, slope: 8, terrainType: 'plains', historicalHazard: 55 },
  kolkata: { elevation: 9, slope: 2, terrainType: 'plains', historicalHazard: 45 },
  mumbai: { elevation: 14, slope: 3, terrainType: 'coastal', historicalHazard: 50 },
  chennai: { elevation: 7, slope: 2, terrainType: 'coastal', historicalHazard: 45 },
  delhi: { elevation: 216, slope: 3, terrainType: 'plains', historicalHazard: 30 },
};

function getTerrainInfo(cityName: string): TerrainInfo | null { const key = cityName.toLowerCase().replace(/\s+/g, ''); if (TERRAIN_DB[key]) return TERRAIN_DB[key]; if (TERRAIN_DB[key.replace('new', '')]) return TERRAIN_DB[key.replace('new', '')]; return null; }
function clamp01(v: number): number { return Math.max(0, Math.min(100, v)); }

export async function assessRisk(location: SelectedLocation): Promise<RiskAssessment> {
  const locationName = `${location.city}, ${location.state}, ${location.country}`;
  const weather = await getWeather(location.latitude, location.longitude, locationName);
  const alerts = generateAlerts(weather);
  const terrain = getTerrainInfo(location.city);
  const isPrototype = !terrain;
  const contributors: RiskContributor[] = [];
  const today = weather.daily[0];
  const rainfallLevel = clamp01((today?.precipitationProbability || 0) * 0.5 + Math.min(100, (today?.precipitationSum || 0) * 5));
  contributors.push({ label: 'Heavy rainfall', level: Math.round(rainfallLevel), description: `${today?.precipitationProbability || 0}% probability, ${(today?.precipitationSum || 0).toFixed(1)}mm expected today` });
  const soilMoistureLevel = clamp01(weather.current.humidity * 0.4 + rainfallLevel * 0.6);
  contributors.push({ label: 'Soil moisture', level: Math.round(soilMoistureLevel), description: `Estimated from ${weather.current.humidity}% humidity and recent rainfall` });
  if (terrain) {
    const slopeLevel = clamp01(terrain.slope * 2.5);
    contributors.push({ label: 'Slope', level: Math.round(slopeLevel), description: `${terrain.slope}° average slope, ${terrain.terrainType} terrain, ${terrain.elevation}m elevation` });
    contributors.push({ label: 'Historical hazard', level: terrain.historicalHazard, description: `Based on terrain type (${terrain.terrainType}) and historical patterns` });
  } else {
    contributors.push({ label: 'Terrain', level: 20, description: 'Terrain data not available for this location — assuming low-to-moderate terrain risk' });
    contributors.push({ label: 'Historical hazard', level: 25, description: 'Historical hazard data not available for this location' });
  }
  const severeAlerts = alerts.filter((a) => a.severity === 'severe' || a.severity === 'extreme');
  const warningLevel = clamp01(severeAlerts.length * 40 + (alerts.length - severeAlerts.length) * 15);
  contributors.push({ label: 'Weather warning', level: Math.round(warningLevel), description: alerts.length > 0 ? `${alerts.length} active alert(s): ${alerts.map((a) => a.title).join(', ')}` : 'No active weather warnings' });
  const weights = [0.3, 0.2, 0.2, 0.15, 0.15];
  const riskScore = Math.round(contributors.reduce((sum, c, i) => sum + c.level * (weights[i] || 0.1), 0));
  let overallRisk: RiskAssessment['overallRisk'] = 'low';
  if (riskScore >= 70) overallRisk = 'very_high'; else if (riskScore >= 50) overallRisk = 'high'; else if (riskScore >= 30) overallRisk = 'moderate';
  const riskLabel = overallRisk === 'very_high' ? 'VERY HIGH ATTENTION' : overallRisk === 'high' ? 'HIGH ATTENTION' : overallRisk === 'moderate' ? 'MODERATE ATTENTION' : 'LOW RISK';
  let explanation = '';
  if (overallRisk === 'very_high' || overallRisk === 'high') {
    explanation = `Current conditions indicate elevated hazard concern for ${location.city}. `;
    if (rainfallLevel > 50) explanation += 'Heavy rainfall and terrain-related factors are contributing to the risk. ';
    if (warningLevel > 30) explanation += 'Active weather warnings are in effect. ';
    explanation += 'Users should monitor official warnings and avoid vulnerable areas if advised by authorities.';
  } else if (overallRisk === 'moderate') {
    explanation = `Conditions in ${location.city} warrant moderate attention. Some weather and terrain factors are elevated but not critical. Stay informed and exercise normal caution.`;
  } else {
    explanation = `Current conditions in ${location.city} do not indicate significant hazard risk. Weather and terrain factors are within normal range.`;
  }
  if (isPrototype) explanation += ' Note: Terrain-specific risk data is limited for this location. The risk model is in prototype mode for this area.';
  return { locationName, overallRisk, riskScore, contributors, explanation, disclaimer: 'Risk insights are decision-support information and do not replace official emergency guidance. Always follow instructions from local authorities and emergency services.', isPrototype };
}

export function formatRiskAssessment(risk: RiskAssessment): string {
  let text = `${risk.locationName}\n\nCurrent Risk: ${risk.overallRisk === 'very_high' ? 'VERY HIGH ATTENTION' : risk.overallRisk === 'high' ? 'HIGH ATTENTION' : risk.overallRisk === 'moderate' ? 'MODERATE ATTENTION' : 'LOW RISK'}\n\nRisk Score: ${risk.riskScore}/100\n\nRisk contributors:\n`;
  for (const c of risk.contributors) { const bars = '█'.repeat(Math.round(c.level / 10)) + '░'.repeat(10 - Math.round(c.level / 10)); text += `${c.label}: ${bars} ${c.level}/100\n  ${c.description}\n`; }
  text += `\nWhat does this mean?\n${risk.explanation}\n\n${risk.disclaimer}`;
  return text;
}
