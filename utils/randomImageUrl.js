export const randomImage = () => {
    const typeImage = ['technology', 'animal', 'nature', 'photograph', 'woods', 'tree', 'jungle', 'snow', 
                        'sand', 'waterfall', 'river', 'sea', 'beach', 'car', 'landscape', 'mountain', 'cyber', 'abstract',
                        'future', 'cat', 'village', 'camping', 'sunset', 'night', 'colorfull', 'green', 'vector', 'cute',
                        'natural', 'city'];
                        
    let indexRandomImage = [];

    while (indexRandomImage.length <= 29) {
      let num = Math.floor(Math.random() * 30 + 1);
      indexRandomImage.push(num);
      indexRandomImage = indexRandomImage.filter((item, index) => {
        return indexRandomImage.indexOf(item) === index
      });
    };
    
    return indexRandomImage.map(num => `https://source.unsplash.com/random/300x300/?${typeImage[num]}`);
}