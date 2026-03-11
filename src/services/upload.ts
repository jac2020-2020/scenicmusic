const seedFromString = (value: string) => {
    let seed = 0;
    for (let i = 0; i < value.length; i++) {
        seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
    }
    return seed;
};

export const uploadImageAndRecognize = async (file: File): Promise<string[]> => {
    // In a real scenario, we would use FormData to upload the file to our backend
    // const formData = new FormData();
    // formData.append('image', file);
    // const response = await axios.post('/api/upload', formData, {
    //     headers: {
    //         'Content-Type': 'multipart/form-data',
    //     },
    // });
    // return response.data.tags;

    // For now, we mock the response with a timeout
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockTags = ['书桌', '咖啡杯', '书本', '阳光', '植物'];
            const seed = seedFromString(file.name || 'file');
            const startIndex = seed % mockTags.length;
            const tags = [
                mockTags[startIndex],
                mockTags[(startIndex + 1) % mockTags.length],
                mockTags[(startIndex + 2) % mockTags.length],
            ];
            resolve(tags);
        }, 3000); // 3 seconds delay to show the loading animation
    });
};
