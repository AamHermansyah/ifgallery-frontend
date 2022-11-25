import { FcSelfie } from "react-icons/fc"
import { GiPalmTree, GiBookshelf } from "react-icons/gi"
import { RiEmotionLaughLine, RiZzzFill } from "react-icons/ri"
import { MdEmojiPeople } from "react-icons/md"
import { BiDotsHorizontal } from "react-icons/bi"
import { GrWorkshop } from "react-icons/gr"

export const userQuery = (userId) => {
    const query = `*[_type == "user" && _id == '${userId}']`

    return query
}

export const memberQuery = () => {
    const query = `*[_type == "user" && role_user == 'admin']`

    return query
}

export const deletePinQuery = (id) => {
    const query = `*[_id == "${id}"][0]`;
    return query
}

export const deleteCommentQuery = (key) => {
  const query = ['comments[0]', `comments[_key=="${key}"]`];
  return query
}

export const unsaveQuery = (saveKey) => {
    const query = ['save[0]', `save[_key=="${saveKey}"]`]

    return query
}

export const searchQuery = (searchTerm) => {
    const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*'] | order(_id) [0...50] {
        _id,
        image_url,
        destination,
        posted_by -> {
            _id,
            username,
            image_url
        },
        save[] {
            _key,
            posted_by -> {
                _id,
                username,
                image_url
            },
        },
    }`;

    return query
}

export const feedQuery = `*[_type == 'pin'] | order(_createAt desc) {
    _id,
    image_url,
    destination,
    title,
    posted_by -> {
        _id,
        username,
        image_url
    },
    save[] {
        _key,
        posted_by -> {
            _id,
            username,
            image_url
        },
    },
}`

export const pinDetailQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    image_url,
    _id,
    _createdAt,
    title, 
    about,
    category,
    destination,
    posted_by -> {
      _id,
      username,
      image_url
    },
    save[] {
        _key,
      posted_by -> {
        _id,
        username,
        image_url
      },
    },
    comments[] {
      comment,
      create_at,
      _key,
      posted_by->{
        _id,
        username,
        image_url,
      },
    }
  }`;
  return query;
};

export const pinDetailEditQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    image_url,
    _id,
    title, 
    about,
    category,
    destination,
    posted_by -> {
      _id,
      username,
      image_url
    }
  }`;
  return query;
};

export const pinDetailMorePinQuery = (pin) => {
  const type = pin.title
    .toLowerCase()
    .split(" ")
    .map((str) => `_type == "pin" && _id != '${pin._id}' && title match "${str}"`)
    .filter((str, index) => index < 4)
    .join(' || ');

  const query = `*[${type}] | order(_createdAt asc) [0...20] {
    image_url,
    _id,
    destination,
    posted_by -> {
      _id,
      username,
      image_url
    },
    save[] {
      _key,
      posted_by -> {
        _id,
        username,
        image_url
      },
    },
  }`;

  return query;
};

export const userCreatedPinsQuery = (userId) => {
  const query = `*[ _type == 'pin' && user_id == '${userId}'] | order(_createdAt desc){
    image_url,
    _id,
    destination,
    title,
    posted_by -> {
      _id,
      username,
      image_url
    },
    save[]{
      posted_by -> {
        _id,
        username,
        image_url
      },
    },
  }`;
  return query;
};

export const userSavedPinsQuery = (userId) => {
  const query = `*[_type == 'pin' && '${userId}' in save[].user_id ] | order(_createdAt desc) {
    image_url,
    _id,
    destination,
    title,
    posted_by -> {
      _id,
      username,
      image_url
    },
    save[]{
      posted_by -> {
        _id,
        username,
        image_url
      },
    },
  }`;
  return query;
};

export const subjectsQuery = `*[_type == 'subjects'] | order(semester asc) {
  subject,
  timetable,
  semester,
  _id
}`;

export const subjectDetailQuery = (id) => {
  return `*[_type == 'subjects' && _id == '${id}'] | order(meeting asc) {
    subject,
    timetable,
    semester,
    _id,
    meetings[]{
      create_at,
      _key,
      topic,
      meeting,
      posted_by -> {
        username
      }
    }
  }`;
}

export const deleteQuery = (id) => {
  return `*[_id == '${id}'][0]`;
}

export const categories = [
    {
        name: 'Fotbar',
        icon: <FcSelfie />
    },
    {
        name: 'Healing',
        icon: <GiPalmTree />
    },
    {
        name: 'Ngampus',
        icon: <GiBookshelf />
    },
    {
        name: 'Kocak',
        icon: <RiEmotionLaughLine />
    },
    {
        name: 'Gabut',
        icon: <RiZzzFill />
    },
    {
        name: 'Kegiatan',
        icon: <GrWorkshop className="opacity-70 hover:bg-opacity-100" />
    },
    {
        name: 'Sendiri aja',
        icon: <MdEmojiPeople />
    },
    {
        name: 'Lainnya',
        icon: <BiDotsHorizontal />
    }
]

export const socials_media = [
  { 
    name: 'facebook', 
    placeholder: 'Username Facebook' 
  },
  { name: 'github', placeholder: 'Username Github' },
  {
    name: 'instagram',
    placeholder: 'Username Instagram'
  },
  {
    name: 'twitter',
    placeholder: 'Username Twitter'
  },
  {
    name: 'telegram',
    placeholder: 'Username Telegram'
  },
  {
    name: 'whatsapp',
    placeholder: 'Nomor Whatsapp'
  }
]

export const organization_fields = ['Ketua Kelas', 'Wakil Ketua Kelas', 'Sekertaris', 'Wakil Sekertaris', 'Bendahara', 'Wakil Bendahara', 'Anggota', 'Maker', 'Guest'];