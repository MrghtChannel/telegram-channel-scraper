const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = process.env.PORT || 3000;

async function getChannelMessages(channel) {
    try {
        const url = `https://t.me/s/${channel}`;
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        let messages = [];

        $('.tgme_widget_message').each((index, element) => {
            const postId = $(element).attr('data-post')?.split('/')[1];
            const postUrl = postId ? `https://t.me/${channel}/${postId}` : `https://t.me/${channel}/${index + 1}`;
            const date = $(element).find('.tgme_widget_message_date time').attr('datetime') || null;

            let text = $(element).find('.tgme_widget_message_text').html();
            if (text) {
                text = text.trim();
            } else {
                text = null;
            }

            const textStyles = [];
            if (text) {
                if (text.includes('<b>')) textStyles.push('bold');
                if (text.includes('<i>')) textStyles.push('italic');
                if (text.includes('<s>')) textStyles.push('strikethrough');
                if (text.includes('<code>')) textStyles.push('monospace');
                if (text.includes('<blockquote>')) textStyles.push('quote');
                if (text.includes('<a href="')) textStyles.push('link');
                if (text.includes('<span class="tgme_widget_message_spoiler">')) textStyles.push('spoiler');
                if (text.includes('<ul>')) textStyles.push('unorderedList');
                if (text.includes('<ol>')) textStyles.push('orderedList');
                if (text.match(/[\u{1F600}-\u{1F64F}]/gu)) textStyles.push('emoji');
            }

            text = text ? text.replace(/<\/?[^>]+(>|$)/g, "") : null;

            let images = [];
            $(element).find('.tgme_widget_message_photo_wrap').each((i, imgElem) => {
                const styleAttr = $(imgElem).attr('style');
                if (styleAttr) {
                    const match = styleAttr.match(/url\(['"]?(.*?)['"]?\)/);
                    if (match && match[1]) {
                        images.push(match[1]);
                    }
                }
            });

            let video = null;
            const videoStyle = $(element).find('.tgme_widget_message_video_thumb').attr('style');
            if (videoStyle) {
                const match = videoStyle.match(/url\(['"]?(.*?)['"]?\)/);
                if (match) video = match[1];
            }

            const document = $(element).find('.tgme_widget_message_document_title').text().trim() || null;

            let voice = null;
            const voiceUrl = $(element).find('.tgme_widget_message_voice').attr('href');
            if (voiceUrl) {
                voice = voiceUrl;
            }

            if (text || images.length || video || document || voice) {
                messages.push({
                    url: postUrl,
                    text,
                    date,
                    images,
                    video,
                    document,
                    voice,
                    styles: textStyles
                });
            }
        });

        return messages;
    } catch (error) {
        console.error('Ошибка при загрузке канала:', error.message);
        return [];
    }
}

app.get('/t.me/s/:channel/json', async (req, res) => {
    const channel = req.params.channel;

    if (!channel) {
        return res.status(400).json({ error: 'Channel parameter is missing' });
    }

    const messages = await getChannelMessages(channel);
    res.json(messages);
});

app.listen(port, () => {
    console.log(`✅ Server is running on http://localhost:${port}`);
});
