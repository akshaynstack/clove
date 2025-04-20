// const channelId = 'UCZy7vibLOxrNyngoHJByZfw';
// const apiKey = 'AIzaSyBSZPvyikBXM62eMWdGc0Qtmdh7xWldmmQ';

export async function getYouTubeLiveVideoId(channelId, apiKey) {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
        return data.items[0].id.videoId;
    }
    console.log('No live video found');
    return null;
}