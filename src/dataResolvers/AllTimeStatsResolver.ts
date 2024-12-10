import { getCompetitorName, getCompetitors } from "../providers/CompetitorProvider";
import { getAllSubmissions, getSubmissionBySpotifyUri } from "../providers/SubmissionProvider";
import { getAllVotes } from "../providers/VoteProvider";

type CommentStats = [submissionId: string, commentLength: number];

interface IDisplayableCommentInfo {

  avgLength: number;

  commenterName: string;

}


interface IDisplayableSubmission {

  songTitle: string;

  artistName: string;

  submitterName: string;

  score: number;

}


const __SUBMISSION_COMMENT_LENGTHS: Map<string, CommentStats[]> = new Map();
const __SUBMISSION_SCORES: Map<string, number> = new Map();
const __VOTE_COMMENT_LENGTHS: Map<string, CommentStats[]> = new Map();


const initializeCache = (): void => {

  if (__SUBMISSION_SCORES.size) {
    __SUBMISSION_SCORES.clear();
  }

  // Initialize map of all submissions and their scores.
  for (const vote of getAllVotes()) {

    const spotifyUri = vote["Spotify URI"];

    if (__SUBMISSION_SCORES.get(spotifyUri)) {
      __SUBMISSION_SCORES.set(
        spotifyUri,
        __SUBMISSION_SCORES.get(spotifyUri) + vote["Points Assigned"]
      )
    } else {
      __SUBMISSION_SCORES.set(
        spotifyUri,
        vote["Points Assigned"] ?? 0
      );
    }

    const stat: CommentStats = [vote["Spotify URI"], vote.Comment?.length ?? 0];

    if (__VOTE_COMMENT_LENGTHS.has(vote["Voter ID"])) {
      __VOTE_COMMENT_LENGTHS.get(vote["Voter ID"]).push(stat);
    } else {
      __VOTE_COMMENT_LENGTHS.set(vote["Voter ID"], [stat]);
    }

  }

  for (const submission of getAllSubmissions()) {

    const stat: CommentStats = [submission["Spotify URI"], submission.Comment?.length ?? 0];

    if (__SUBMISSION_COMMENT_LENGTHS.has(submission["Submitter ID"])) {
      __SUBMISSION_COMMENT_LENGTHS.get(submission["Submitter ID"]).push(stat);
    } else {
      __SUBMISSION_COMMENT_LENGTHS.set(submission["Submitter ID"], [stat]);
    }

  }

};


export const getBestAndWorstSubmission = (): [best: IDisplayableSubmission, worst: IDisplayableSubmission] => {

  if (!__SUBMISSION_SCORES.size) {
    initializeCache();
  }

  let bestUri: [string, number] = ['', -Infinity];
  let worstUri: [string, number] = ['', Infinity];

  for (const [uri, votes] of __SUBMISSION_SCORES.entries()) {

    if (votes < worstUri[1]) {
      worstUri = [uri, votes];
    }

    if (votes > bestUri[1]) {
      bestUri = [uri, votes];
    }

  }

  const bestSong = getSubmissionBySpotifyUri(bestUri[0]);
  const worstSong = getSubmissionBySpotifyUri(worstUri[0]);

  return [
    {
      artistName: bestSong["Artist(s)"],
      score: bestUri[1],
      songTitle: bestSong.Title,
      submitterName: getCompetitorName(bestSong["Submitter ID"])
    },
    {
      artistName: worstSong["Artist(s)"],
      score: worstUri[1],
      songTitle: worstSong.Title,
      submitterName: getCompetitorName(worstSong["Submitter ID"])
    }
  ];

};


export const getAvgCommentLengthFor = (userId: string, about: 'other' | 'own'): number => {

  if (!__SUBMISSION_SCORES.size) {
    initializeCache();
  }

  const statMap = about === 'other'
    ? __VOTE_COMMENT_LENGTHS
    : __SUBMISSION_COMMENT_LENGTHS;

  const commentStats = statMap.get(userId);

  if (!commentStats) {
    return 0;
  }

  let totalLengths = 0;

  commentStats.forEach(stat => totalLengths += stat[1]);

  return totalLengths / commentStats.length;

};


export const getLongestCommentFor = (userId: string, about: 'other' | 'own'): CommentStats => {

  if (!__SUBMISSION_SCORES.size) {
    initializeCache();
  }

  const statMap = about === 'other'
    ? __VOTE_COMMENT_LENGTHS
    : __SUBMISSION_COMMENT_LENGTHS;

  let longest: CommentStats = ['', -Infinity];

  for (const comment of statMap.get(userId)) {

    if (comment[1] > longest[1]) {
      longest = comment;
    }

  }

  return longest;

};


export const getMostAndLeastWordyCommenter = (about: 'other' | 'own'): [most: IDisplayableCommentInfo, least: IDisplayableCommentInfo] => {

  if (!__SUBMISSION_SCORES.size) {
    initializeCache();
  }

  let mostWordyLength = -Infinity;
  let mostWordyUserId: string;
  let leastWordyLength = Infinity;
  let leastWordyUserId: string;

  for (const user of getCompetitors()) {

    const avgCommentLength = getAvgCommentLengthFor(user.ID, about);

    if (avgCommentLength > mostWordyLength) {
      mostWordyLength = avgCommentLength;
      mostWordyUserId = user.ID;
    }

    if (avgCommentLength < leastWordyLength) {
      leastWordyLength = avgCommentLength;
      leastWordyUserId = user.ID;
    }

  }

  return [
    {
      avgLength: mostWordyLength,
      commenterName: getCompetitorName(mostWordyUserId)
    },
    {
      avgLength: leastWordyLength,
      commenterName: getCompetitorName(leastWordyUserId)
    }
  ];

};
