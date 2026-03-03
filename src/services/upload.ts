// Mock function for image recognition
export const uploadImageAndRecognize = async (_file: File): Promise<string[]> => {
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
            // Mock tags based on the file name or just random
            const mockTags = ['书桌', '咖啡杯', '书本', '阳光', '植物'];
            // randomly pick 3 tags
            const shuffled = mockTags.sort(() => 0.5 - Math.random());
            resolve(shuffled.slice(0, 3));
        }, 3000); // 3 seconds delay to show the loading animation
    });
};
