import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Text as SvgText, Rect, Line } from 'react-native-svg';
import { Droplets, Thermometer } from 'lucide-react-native';
import { ClimateData } from '@/lib/types';
import { Colors } from '@/lib/theme';

const { width: screenWidth } = Dimensions.get('window');
const CHART_WIDTH = screenWidth - 56;
const CHART_HEIGHT = 180;
const PAD_L = 32;
const PAD_R = 12;
const PAD_T = 16;
const PAD_B = 28;

interface ClimateChartProps { data: ClimateData; }

export function ClimateChart({ data }: ClimateChartProps) {
  if (!data.records.length) return null;
  const temps = data.records.flatMap((r) => [r.minTemp, r.maxTemp, r.avgTemp]);
  const minTemp = Math.floor(Math.min(...temps) - 2);
  const maxTemp = Math.ceil(Math.max(...temps) + 2);
  const tempRange = maxTemp - minTemp || 1;
  const maxPrecip = Math.max(...data.records.map((r) => r.precipitation), 1);
  const innerW = CHART_WIDTH - PAD_L - PAD_R;
  const innerH = CHART_HEIGHT - PAD_T - PAD_B;
  const barW = innerW / data.records.length;
  const tempToY = (t: number) => PAD_T + innerH - ((t - minTemp) / tempRange) * innerH;
  const pts = data.records.map((r, i) => ({ x: PAD_L + barW * i + barW / 2, avgY: tempToY(r.avgTemp), minY: tempToY(r.minTemp), maxY: tempToY(r.maxTemp), label: r.month, avg: r.avgTemp }));
  const avgLinePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.avgY}`).join(' ');
  const maxLinePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.maxY}`).join(' ');
  const minLinePath = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.minY}`).join(' ');
  const areaPath = `${maxLinePath} ` + [...pts].reverse().map((p) => `L ${p.x} ${p.minY}`).join(' ') + ' Z';
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => { const y = PAD_T + innerH * f; const tempVal = maxTemp - tempRange * f; return { y, tempVal: Math.round(tempVal) }; });

  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        <SummaryCard icon={<Thermometer size={20} color={Colors.primary[600]} />} label="Yearly Avg" value={`${data.yearlyAvgTemp}°C`} />
        <SummaryCard icon={<Droplets size={20} color={Colors.secondary[600]} />} label="Total Precip" value={`${data.yearlyTotalPrecipitation}mm`} />
      </View>
      <View style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <Text style={styles.chartTitle}>Temperature (°C)</Text>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}><View style={[styles.legendLine, { backgroundColor: Colors.accent[500] }]} /><Text style={styles.legendText}>Max</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendLine, { backgroundColor: Colors.primary[500] }]} /><Text style={styles.legendText}>Avg</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendLine, { backgroundColor: Colors.secondary[500] }]} /><Text style={styles.legendText}>Min</Text></View>
          </View>
        </View>
        <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
          {gridLines.map((g, i) => <Line key={i} x1={PAD_L} y1={g.y} x2={CHART_WIDTH - PAD_R} y2={g.y} stroke={Colors.neutral[200]} strokeWidth={1} strokeDasharray="4 4" />)}
          {gridLines.map((g, i) => <SvgText key={`t${i}`} x={4} y={g.y + 4} fontSize={10} fill={Colors.neutral[400]} fontFamily="Inter-Regular">{g.tempVal}°</SvgText>)}
          <Path d={areaPath} fill={Colors.primary[50]} opacity={0.6} />
          <Path d={maxLinePath} stroke={Colors.accent[500]} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <Path d={avgLinePath} stroke={Colors.primary[500]} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <Path d={minLinePath} stroke={Colors.secondary[500]} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          {pts.map((p, i) => <SvgText key={`l${i}`} x={p.x} y={CHART_HEIGHT - 8} fontSize={9} fill={Colors.neutral[500]} fontFamily="Inter-Regular" textAnchor="middle">{p.label}</SvgText>)}
          {pts.map((p, i) => <CircleDot key={`d${i}`} x={p.x} y={p.avgY} color={Colors.primary[600]} />)}
        </Svg>
      </View>
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Precipitation (mm)</Text>
        <View style={styles.precipBars}>
          {data.records.map((r, i) => (
            <View key={i} style={styles.precipBarWrap}>
              <View style={styles.precipBarContainer}><View style={[styles.precipBar, { height: `${(r.precipitation / maxPrecip) * 100}%` }]} /></View>
              <Text style={styles.precipLabel}>{r.month}</Text>
              <Text style={styles.precipValue}>{r.precipitation}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.monthlyGrid}>
        {data.records.map((r, i) => (
          <View key={i} style={styles.monthlyCard}>
            <Text style={styles.monthlyMonth}>{r.month}</Text>
            <Text style={styles.monthlyTemp}>{r.minTemp}° - {r.maxTemp}°C</Text>
            <Text style={styles.monthlyPrecip}>{r.precipitation}mm</Text>
            <Text style={styles.monthlyHumidity}>{r.humidity}% humidity</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function CircleDot({ x, y, color }: { x: number; y: number; color: string }) {
  return <Rect x={x - 3} y={y - 3} width={6} height={6} rx={3} fill={color} />;
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (<View style={styles.summaryCard}>{icon}<View style={styles.summaryText}><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text></View></View>);
}

const styles = StyleSheet.create({
  container: { gap: 16 },
  summaryRow: { flexDirection: 'row', gap: 12 },
  summaryCard: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.neutral[50], borderRadius: 16, padding: 16, borderWidth: 1, borderColor: Colors.neutral[200] },
  summaryText: { flex: 1 },
  summaryLabel: { fontSize: 12, fontFamily: 'Inter-Regular', color: Colors.neutral[500], marginBottom: 2 },
  summaryValue: { fontSize: 20, fontFamily: 'Inter-Bold', color: Colors.neutral[800] },
  chartCard: { backgroundColor: Colors.neutral[0], borderRadius: 20, padding: 16, borderWidth: 1, borderColor: Colors.neutral[200] },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 },
  chartTitle: { fontSize: 16, fontFamily: 'Inter-SemiBold', color: Colors.neutral[800] },
  legendRow: { flexDirection: 'row', gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendLine: { width: 16, height: 3, borderRadius: 2 },
  legendText: { fontSize: 11, fontFamily: 'Inter-Regular', color: Colors.neutral[500] },
  precipBars: { flexDirection: 'row', height: 140, alignItems: 'flex-end', gap: 4, marginTop: 8 },
  precipBarWrap: { flex: 1, alignItems: 'center' },
  precipBarContainer: { width: '80%', height: 100, justifyContent: 'flex-end', alignItems: 'center' },
  precipBar: { width: '100%', backgroundColor: Colors.secondary[400], borderRadius: 4, minHeight: 2 },
  precipLabel: { fontSize: 9, fontFamily: 'Inter-Regular', color: Colors.neutral[500], marginTop: 4 },
  precipValue: { fontSize: 9, fontFamily: 'Inter-SemiBold', color: Colors.neutral[700] },
  monthlyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  monthlyCard: { flex: 1, minWidth: (screenWidth - 56) / 3 - 4, backgroundColor: Colors.neutral[50], borderRadius: 12, padding: 10, borderWidth: 1, borderColor: Colors.neutral[200] },
  monthlyMonth: { fontSize: 13, fontFamily: 'Inter-SemiBold', color: Colors.neutral[700], marginBottom: 4 },
  monthlyTemp: { fontSize: 11, fontFamily: 'Inter-Regular', color: Colors.neutral[600], marginBottom: 2 },
  monthlyPrecip: { fontSize: 11, fontFamily: 'Inter-Regular', color: Colors.secondary[600], marginBottom: 2 },
  monthlyHumidity: { fontSize: 10, fontFamily: 'Inter-Regular', color: Colors.neutral[400] },
});
