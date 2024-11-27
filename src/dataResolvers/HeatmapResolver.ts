import { getCompetitors } from "../providers/CompetitorProvider";
import { getVotesByCompetitors } from "../providers/VoteProvider";

export const resolveHeatmapData = (activeCompetitors?: Set<string>, activeRounds?: Set<string>): ApexAxisChartSeries => {

  console.log('Filtering');
  console.log(activeCompetitors);
  console.log(activeRounds);

  const series: ApexAxisChartSeries = [];

  const filterCompetitors: boolean = activeCompetitors?.size > 1;

  for (const competitor of getCompetitors().reverse()) {

    if (filterCompetitors && !activeCompetitors.has(competitor.ID)) {
      continue;
    }

    const data = [];

    for (const recipient of getCompetitors()) {

      if (filterCompetitors && !activeCompetitors.has(recipient.ID)) {
        continue;
      }

      data.push({
        x: recipient.Name,
        y: getVotesByCompetitors(recipient.ID, competitor.ID, activeRounds)
      });

    }

    series.push({
      data,
      name: competitor.Name
    });

  }

  return series;

}
