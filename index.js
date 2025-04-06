const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

// Function to get messages from the channel
async function getChannelMessages(channel) {
    try {
        const url = `https://t.me/s/${channel}`;
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        const messages = [];

        $('.tgme_widget_message').each((index, element) => {
            const text = $(element).find('.tgme_widget_message_text').text().trim() || null;
            const date = $(element).find('.tgme_widget_message_date time').attr('datetime') || null;

            let image = null;
            const imageStyle = $(element).find('.tgme_widget_message_photo_wrap').attr('style');
            if (imageStyle) {
                const match = imageStyle.match(/url\(['"]?(.*?)['"]?\)/);
                if (match) image = match[1];
            }

            let video = null;
            const videoStyle = $(element).find('.tgme_widget_message_video_thumb').attr('style');
            if (videoStyle) {
                const match = videoStyle.match(/url\(['"]?(.*?)['"]?\)/);
                if (match) video = match[1];
            }

            const document = $(element).find('.tgme_widget_message_document_title').text().trim() || null;

            if (text || image || video || document) {
                messages.push({
                    text,
                    date,
                    image,
                    video,
                    document
                });
            }
        });

        return messages;
    } catch (error) {
        console.error('Error while fetching messages:', error.message);
        return [];
    }
}

// API endpoint to fetch messages from the channel
app.get('/t.me/s/:channel/json', async (req, res) => {
    const channel = req.params.channel;

    if (!channel) {
        return res.status(400).json({ error: 'Channel parameter is missing' });
    }

    const messages = await getChannelMessages(channel);
    res.json(messages);
});

// Start the server
app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
});
