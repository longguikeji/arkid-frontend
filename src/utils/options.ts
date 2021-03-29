export default function ChangeOptions(data: any) {
  if (data === null) {
    return
  }
  data.forEach((option: any) => {
    option.value = option.id;
    option.label = option.title;
  });
}