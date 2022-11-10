export const handleGDImageId = (link) => {
    const regex = /(d\/[\w|\d|\-\_]+\/)/gi;
    if(regex.test(link)){
      const google_drive_image_id = link.match(regex)[0].replace(/^d\/|\//gi, '')

      return `https://drive.google.com/uc?export=view&id=${google_drive_image_id}`;
    }

    return false;
  }