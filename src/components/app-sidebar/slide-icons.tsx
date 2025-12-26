export const FourImageColumnsIcon = () => {
  return (
    <div className="w-full h-full flex flex-col gap-1">
      <div className="w-full h-3 bg-gray-200 rounded" />

      <div className="w-full h-8 bg-gray-200 rounded flex justify-center items-center" />

      <div className="w-full h-full flex gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="w-1/4 flex flex-col gap-1">
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const TwoImageColumnsIcon = () => {
  return (
    <div className="w-full h-full flex flex-col gap-1">
      <div className="w-full h-3 bg-gray-200 rounded" />

      <div className="w-full h-8 bg-gray-200 rounded flex justify-center items-center" />

      <div className="w-full h-full flex gap-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="w-1/2 flex flex-col gap-1">
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ThreeImageColumnsIcon = () => {
  return (
    <div className="w-full h-full flex flex-col gap-1">
      <div className="w-full h-3 bg-gray-200 rounded" />

      <div className="w-full h-8 bg-gray-200 rounded flex justify-center items-center" />

      <div className="w-full h-full flex gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="w-1/3 flex flex-col gap-1">
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const BulletsIcon = () => {
  return (
    <div className="w-full h-full flex flex-col gap-1">
      <div className="h-3 bg-gray-300 rounded w-3/4 mb-1" />

      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-2 items-center">
          <div className="w-1 h-1 bg-gray-200 rounded-full" />
          <div className="h-2 bg-gray-200 rounded flex-1" />
        </div>
      ))}
    </div>
  );
};

export const BlankCardIcon = () => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-3/4 h-2 bg-gray-200 rounded" />
    </div>
  );
};

export const ImageAndTextIcon = () => {
  return (
    <div className="w-full h-full flex gap-2">
      <div className="w-1/2 bg-gray-200 rounded" />

      <div className="w-1/2 flex flex-col gap-1">
        <div className="h-2 bg-gray-200 rounded w-full" />
        <div className="h-2 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
};

export const ThreeColumnsWithHeadingsIcon = () => {
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      <div className="w-full h-4 bg-gray-200 rounded" />
      <div className="w-full h-full flex gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="w-1/3 flex flex-col gap-1">
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const TwoColumnsWithHeadingsIcon = () => {
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      <div className="w-full h-4 bg-gray-200 rounded" />
      <div className="w-full h-full flex gap-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="w-1/2 flex flex-col gap-1">
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-full" />
            <div className="h-1 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const FourColumnsIcon = () => {
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      <div className="w-full h-4 bg-gray-200 rounded" />
      <div className="w-full h-full flex gap-2">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="w-1/4 flex flex-col gap-1">
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const ThreeColumnsIcon = () => {
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      <div className="w-full h-4 bg-gray-200 rounded" />
      <div className="w-full h-full flex gap-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="w-1/3 flex flex-col gap-1">
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const TwoColumnsIcon = () => {
  return (
    <div className="w-full h-full flex flex-col gap-3 items-center justify-center">
      <div className="w-full h-4 bg-gray-200 rounded" />
      <div className="w-full h-full flex gap-2">
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className="w-1/2 flex flex-col gap-1">
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-200 rounded w-full" />
            <div className="h-2 bg-gray-200 rounded w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
};

export function TextAndImageIcon() {
  return (
    <div className="w-full h-full flex gap-2">
      <div className="w-1/2 flex flex-col gap-1">
        <div className="h-2 bg-gray-200 rounded w-full" />
        <div className="h-2 bg-gray-200 rounded w-2/3" />
      </div>
      <div className="w-1/2 bg-gray-200 rounded" />
    </div>
  );
}
