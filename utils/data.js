import { FcSelfie } from "react-icons/fc"
import { GiPalmTree, GiBookshelf } from "react-icons/gi"
import { RiEmotionLaughLine, RiZzzFill } from "react-icons/ri"
import { MdEmojiPeople } from "react-icons/md"
import { BiDotsHorizontal } from "react-icons/bi"

export const userQuery = (userId) => {
    const query = `*[_type == "user" && _id == '${userId}']`

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

export const pinDetailMorePinQuery = (pin) => {
  const query = `*[_type == "pin" && _id != '${pin._id}' || title match '${pin.title}*' || about match '${pin.about}*'] | order(_id) [0...20] {
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
        name: 'Sendiri aja',
        icon: <MdEmojiPeople />
    },
    {
        name: 'Lainnya',
        icon: <BiDotsHorizontal />
    }
]